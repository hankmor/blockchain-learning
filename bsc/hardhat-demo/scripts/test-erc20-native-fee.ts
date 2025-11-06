import { ethers } from "hardhat";

// 配置：替换为你的合约地址
const CONTRACT_ADDRESS = "0x你的合约地址";

async function main() {
  const [sender, recipient, feeRecipient] = await ethers.getSigners();

  console.log("发送者地址:", sender.address);
  console.log("接收者地址:", recipient.address);
  console.log("手续费接收地址:", feeRecipient.address);

  const token = await ethers.getContractAt("ERC20WithNativeFee", CONTRACT_ADDRESS);

  // 查询手续费金额
  const nativeFeeAmount = await token.nativeFeeAmount();
  const requiredFee = await token.getRequiredFee(sender.address, recipient.address);

  console.log("\n手续费信息:");
  console.log("固定手续费:", ethers.formatEther(nativeFeeAmount), "BNB");
  console.log("本次转账所需手续费:", ethers.formatEther(requiredFee), "BNB");

  // 查询余额
  const senderBalanceBefore = await token.balanceOf(sender.address);
  const recipientBalanceBefore = await token.balanceOf(recipient.address);
  const feeRecipientBalanceBefore = await ethers.provider.getBalance(feeRecipient.address);

  console.log("\n转账前余额:");
  console.log("发送者代币余额:", ethers.formatEther(senderBalanceBefore));
  console.log("接收者代币余额:", ethers.formatEther(recipientBalanceBefore));
  console.log("手续费接收者 BNB 余额:", ethers.formatEther(feeRecipientBalanceBefore));

  // 转账金额
  const transferAmount = ethers.parseEther("100"); // 转账 100 个代币

  console.log("\n执行转账:", ethers.formatEther(transferAmount), "代币");
  console.log("需要支付手续费:", ethers.formatEther(nativeFeeAmount), "BNB");

  // 执行转账（需要同时发送原生代币作为手续费）
  const tx = await token.transfer(recipient.address, transferAmount, {
    value: nativeFeeAmount, // 支付原生代币手续费
  });

  console.log("交易哈希:", tx.hash);
  const receipt = await tx.wait();
  console.log("交易确认，区块号:", receipt?.blockNumber);

  // 查询转账后余额
  const senderBalanceAfter = await token.balanceOf(sender.address);
  const recipientBalanceAfter = await token.balanceOf(recipient.address);
  const feeRecipientBalanceAfter = await ethers.provider.getBalance(feeRecipient.address);

  console.log("\n转账后余额:");
  console.log("发送者代币余额:", ethers.formatEther(senderBalanceAfter));
  console.log("接收者代币余额:", ethers.formatEther(recipientBalanceAfter));
  console.log("手续费接收者 BNB 余额:", ethers.formatEther(feeRecipientBalanceAfter));

  console.log("\n✅ 转账成功!");
  console.log("代币变化:", ethers.formatEther(senderBalanceBefore - senderBalanceAfter), "→", ethers.formatEther(senderBalanceAfter));
  console.log("手续费变化:", ethers.formatEther(feeRecipientBalanceAfter - feeRecipientBalanceBefore), "BNB");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

