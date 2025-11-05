// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IReputationEngine } from "./interfaces/IReputationEngine.sol";
import { Types } from "./libraries/Types.sol";

contract LoanContract is Ownable, ReentrancyGuard {
  using Types for Types.LoanRequest;
  using Types for Types.LoanAgreement;

  event LoanRequested(string indexed loanId, address indexed borrower, uint256 amount, uint256 durationDays);
  event LoanFunded(string indexed loanId, address indexed lender, uint256 amountFunded, uint256 interestRateBps);
  event LoanRepaid(string indexed loanId, address indexed borrower, uint256 repaymentAmount);
  event LoanDefaulted(string indexed loanId, address indexed borrower);

  IReputationEngine public immutable reputationEngine;

  // governance parameters (simplified)
  uint256 public interestRateCapBps; // e.g. 2500 = 25%
  uint256 public maxLoanAmount;
  uint256 public defaultPenaltyScore; // delta score on default

  mapping(string => Types.LoanRequest) public loanIdToRequest;
  mapping(string => Types.LoanAgreement) public loanIdToAgreement;

  constructor(
    address initialOwner,
    IReputationEngine _reputationEngine,
    uint256 _interestRateCapBps,
    uint256 _maxLoanAmount,
    uint256 _defaultPenaltyScore
  ) Ownable(initialOwner) {
    require(address(_reputationEngine) != address(0), "invalid reputation engine");
    require(_interestRateCapBps > 0, "invalid cap");
    reputationEngine = _reputationEngine;
    interestRateCapBps = _interestRateCapBps;
    maxLoanAmount = _maxLoanAmount;
    defaultPenaltyScore = _defaultPenaltyScore;
  }

  // createLoanRequest: borrower posts a request with optional collateral (payable)
  function createLoanRequest(
    string calldata loanId,
    uint256 amount,
    uint256 durationDays,
    string calldata purpose,
    uint256 collateralAmount
  ) external payable {
    require(loanIdToRequest[loanId].borrower == address(0), "loan exists");
    require(amount > 0 && amount <= maxLoanAmount, "invalid amount");
    require(durationDays > 0, "invalid duration");
    require(msg.value == collateralAmount, "collateral mismatch");

    Types.ReputationProfile memory rep = reputationEngine.getReputation(msg.sender);
    Types.LoanRequest memory req = Types.LoanRequest({
      loanId: loanId,
      borrower: msg.sender,
      amount: amount,
      durationDays: durationDays,
      purpose: purpose,
      requestedAt: block.timestamp,
      reputationScoreAtRequest: rep.score,
      collateralAmount: collateralAmount,
      status: Types.RequestStatus.Pending
    });

    loanIdToRequest[loanId] = req;
    emit LoanRequested(loanId, msg.sender, amount, durationDays);
  }

  // fundLoan: lender funds the request (escrow -> borrower), set agreement
  function fundLoan(
    string calldata loanId,
    uint256 interestRateBps
  ) external payable nonReentrant {
    Types.LoanRequest storage req = loanIdToRequest[loanId];
    require(req.borrower != address(0), "no request");
    require(req.status == Types.RequestStatus.Pending, "not pending");
    require(interestRateBps > 0 && interestRateBps <= interestRateCapBps, "rate too high");
    require(msg.value == req.amount, "funding mismatch");

    require(loanIdToAgreement[loanId].borrower == address(0), "agreement exists");

    uint256 repaymentDue = block.timestamp + (req.durationDays * 1 days);
    uint256 repaymentAmount = req.amount + ((req.amount * interestRateBps) / 10000);

    Types.LoanAgreement memory agreement = Types.LoanAgreement({
      loanId: loanId,
      borrower: req.borrower,
      lender: msg.sender,
      fundedAt: block.timestamp,
      repaymentDue: repaymentDue,
      amountFunded: req.amount,
      interestRate: interestRateBps,
      repaymentAmount: repaymentAmount,
      status: Types.AgreementStatus.Active
    });

    loanIdToAgreement[loanId] = agreement;
    req.status = Types.RequestStatus.Funded;

    // transfer funds to borrower
    (bool sent, ) = payable(req.borrower).call{ value: req.amount }("");
    require(sent, "transfer failed");

    emit LoanFunded(loanId, msg.sender, req.amount, interestRateBps);
  }

  // repayLoan: borrower repays; collateral returned and reputation updated positively
  function repayLoan(string calldata loanId) external payable nonReentrant {
    Types.LoanAgreement storage agreement = loanIdToAgreement[loanId];
    Types.LoanRequest storage req = loanIdToRequest[loanId];
    require(agreement.borrower != address(0), "no agreement");
    require(agreement.status == Types.AgreementStatus.Active, "not active");
    require(msg.sender == agreement.borrower, "not borrower");
    require(msg.value == agreement.repaymentAmount, "repayment mismatch");

    agreement.status = Types.AgreementStatus.Repaid;

    // send repayment to lender
    (bool sentLender, ) = payable(agreement.lender).call{ value: msg.value }("");
    require(sentLender, "pay lender failed");

    // return collateral to borrower if any
    if (req.collateralAmount > 0) {
      (bool sentBorrower, ) = payable(req.borrower).call{ value: req.collateralAmount }("");
      require(sentBorrower, "return collateral failed");
      req.collateralAmount = 0;
    }

    // positive reputation delta (e.g., +200 = +2.00)
    reputationEngine.updateReputation(agreement.borrower, 200, true);

    emit LoanRepaid(loanId, msg.sender, msg.value);
  }

  // mark default after due date; slash collateral to lender; negative reputation
  function penalizeDefault(string calldata loanId) external nonReentrant {
    Types.LoanAgreement storage agreement = loanIdToAgreement[loanId];
    Types.LoanRequest storage req = loanIdToRequest[loanId];
    require(agreement.borrower != address(0), "no agreement");
    require(agreement.status == Types.AgreementStatus.Active, "not active");
    require(block.timestamp > agreement.repaymentDue, "not due");

    agreement.status = Types.AgreementStatus.Defaulted;

    if (req.collateralAmount > 0) {
      (bool sentLender, ) = payable(agreement.lender).call{ value: req.collateralAmount }("");
      require(sentLender, "slash collateral failed");
      req.collateralAmount = 0;
    }

    reputationEngine.updateReputation(agreement.borrower, defaultPenaltyScore, false);
    emit LoanDefaulted(loanId, agreement.borrower);
  }

  // owner governance setters
  function setInterestRateCap(uint256 newCapBps) external onlyOwner {
    require(newCapBps > 0, "invalid cap");
    interestRateCapBps = newCapBps;
  }

  function setMaxLoanAmount(uint256 newMax) external onlyOwner {
    require(newMax > 0, "invalid max");
    maxLoanAmount = newMax;
  }

  function setDefaultPenaltyScore(uint256 newPenalty) external onlyOwner {
    defaultPenaltyScore = newPenalty;
  }
}


