import { ethers } from "hardhat";

async function main() {
  const [deployer, feeRecipient] = await ethers.getSigners();

  console.log("部署者地址:", deployer.address);
  console.log("手续费接收地址:", feeRecipient.address);
  console.log("部署者余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

  // 配置参数
  const tokenName = "Fee Token";
  const tokenSymbol = "FEE";
  const totalSupply = 1000000n; // 100万代币
  const decimals = 18;
  const nativeFeeAmount = ethers.parseEther("0.001"); // 每次转账收取 0.001 BNB

  console.log("\n部署 ERC20WithNativeFee 合约...");
  console.log("代币名称:", tokenName);
  console.log("代币符号:", tokenSymbol);
  console.log("总供应量:", totalSupply.toString());
  console.log("手续费金额:", ethers.formatEther(nativeFeeAmount), "BNB");

  const ERC20WithNativeFee = await ethers.getContractFactory("ERC20WithNativeFee");
  const token = await ERC20WithNativeFee.deploy(
    tokenName,
    tokenSymbol,
    totalSupply,
    decimals,
    feeRecipient.address,
    nativeFeeAmount
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("\n✅ 合约部署成功!");
  console.log("合约地址:", tokenAddress);
  console.log("手续费接收地址:", await token.feeRecipient());
  console.log("手续费金额:", ethers.formatEther(await token.nativeFeeAmount()), "BNB");

  // 验证部署者的代币余额
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("\n部署者代币余额:", ethers.formatEther(deployerBalance), tokenSymbol);

  return tokenAddress;
}

main()
  .then((address) => {
    console.log("\n合约地址:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

