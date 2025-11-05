// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Types } from "./libraries/Types.sol";
import { IReputationEngine } from "./interfaces/IReputationEngine.sol";

contract ReputationEngine is Ownable, IReputationEngine {
  using Types for Types.ReputationProfile;

  mapping(address => Types.ReputationProfile) private userToProfile;

  constructor(address initialOwner) Ownable(initialOwner) {}

  function getReputation(address user) public view override returns (Types.ReputationProfile memory) {
    Types.ReputationProfile memory profile = userToProfile[user];
    if (profile.walletAddress == address(0)) {
      profile = Types.ReputationProfile({
        walletAddress: user,
        score: 6000, // default 60.00
        tier: Types.ReputationTier.C,
        lastUpdated: block.timestamp
      });
    }
    return profile;
  }

  function updateReputation(
    address user,
    uint256 deltaScore,
    bool isIncrease
  ) public override onlyOwner returns (Types.ReputationProfile memory) {
    Types.ReputationProfile memory current = getReputation(user);
    uint256 newScore = isIncrease ? current.score + deltaScore : _saturatingSub(current.score, deltaScore);
    Types.ReputationTier newTier = _scoreToTier(newScore);
    Types.ReputationProfile memory updated = Types.ReputationProfile({
      walletAddress: user,
      score: newScore,
      tier: newTier,
      lastUpdated: block.timestamp
    });
    userToProfile[user] = updated;
    emit ReputationUpdated(user, newScore, newTier);
    return updated;
  }

  function _scoreToTier(uint256 score) internal pure returns (Types.ReputationTier) {
    if (score >= 8000) return Types.ReputationTier.A; // 80+
    if (score >= 7000) return Types.ReputationTier.B; // 70-79
    if (score >= 6000) return Types.ReputationTier.C; // 60-69
    return Types.ReputationTier.D; // <60
  }

  function _saturatingSub(uint256 a, uint256 b) internal pure returns (uint256) {
    return b > a ? 0 : a - b;
  }
}


