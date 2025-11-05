// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Types } from "../libraries/Types.sol";

interface IReputationEngine {
  event ReputationUpdated(address indexed user, uint256 newScore, Types.ReputationTier newTier);

  function getReputation(address user) external view returns (Types.ReputationProfile memory);

  function updateReputation(
    address user,
    uint256 deltaScore, // positive or negative expressed as unsigned with isIncrease
    bool isIncrease
  ) external returns (Types.ReputationProfile memory);
}


