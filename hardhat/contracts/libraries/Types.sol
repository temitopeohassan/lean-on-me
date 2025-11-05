// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Types {
  enum BorrowerStatus { Active, Defaulted, Repaid }
  enum RiskCategory { Low, Medium, High }
  enum ReputationTier { A, B, C, D }
  enum RequestStatus { Pending, Funded, Cancelled }
  enum AgreementStatus { Active, Repaid, Defaulted }

  struct EASAttestation {
    string attestationId;
    address issuer;
    string attestationType; // incomeProof | identity | peerTrust | employment
    string value;
    uint256 issuedAt;
    bool verified;
  }

  struct LoanRequest {
    string loanId;
    address borrower;
    uint256 amount;
    uint256 durationDays;
    string purpose;
    uint256 requestedAt;
    uint256 reputationScoreAtRequest;
    uint256 collateralAmount;
    RequestStatus status;
  }

  struct LoanAgreement {
    string loanId;
    address borrower;
    address lender;
    uint256 fundedAt;
    uint256 repaymentDue;
    uint256 amountFunded;
    uint256 interestRate; // in bps (1% = 100)
    uint256 repaymentAmount;
    AgreementStatus status;
  }

  struct ReputationProfile {
    address walletAddress;
    uint256 score; // scaled by 1e2 to represent float
    ReputationTier tier;
    uint256 lastUpdated;
  }
}


