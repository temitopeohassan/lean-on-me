import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying contracts...");
  console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("---");

  // Deploy ReputationEngine
  console.log("Deploying ReputationEngine...");
  const ReputationEngine = await ethers.getContractFactory("ReputationEngine");
  const reputation = await ReputationEngine.deploy(deployer.address);
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("ReputationEngine deployed to:", reputationAddress);
  console.log("---");

  // Deploy LoanContract
  console.log("Deploying LoanContract...");
  const LoanContract = await ethers.getContractFactory("LoanContract");
  const interestRateCapBps = 2500; // 25%
  const maxLoanAmount = ethers.parseEther("10");
  const defaultPenaltyScore = 500; // -5.00

  
  const deployTx = await LoanContract.deploy(
    deployer.address,
    reputationAddress,
    interestRateCapBps,
    maxLoanAmount,
    defaultPenaltyScore
  );
  
  console.log("Transaction hash:", deployTx.deploymentTransaction()?.hash);
  console.log("Waiting for deployment confirmation...");
  
  await deployTx.waitForDeployment();
  const loanAddress = await deployTx.getAddress();
  console.log("LoanContract deployed to:", loanAddress);
  console.log("---");

  console.log("\n=== Deployment Summary ===");
  console.log("ReputationEngine:", reputationAddress);
  console.log("LoanContract:", loanAddress);
  console.log("Owner:", deployer.address);
  console.log("Interest Rate Cap:", interestRateCapBps / 100, "%");
  console.log("Max Loan Amount:", ethers.formatEther(maxLoanAmount), "ETH");
  console.log("Default Penalty Score:", defaultPenaltyScore);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


