import { network } from "hardhat";
import { getContract, parseAbi, encodeFunctionData } from "viem";

console.log("🔗 连接到已部署的合约...\n");

// ===== 配置部分 =====
// 1. 合约地址（替换成你部署的合约地址）
// https://testnet.bscscan.com/address/0x6feaead4af6270eec353c5a448d594b101abc2f0
const COUNTER_ADDRESS = "0x6feaead4af6270eec353c5a448d594b101abc2f0" as `0x${string}`;
const NETWORK = "bscTestnet";

// 2. 合约 ABI（可以手动定义或从编译产物中读取）
const COUNTER_ABI = parseAbi([
  "function x() view returns (uint256)",
  "function inc() public",
  "function incBy(uint256 by) public",
  "event Increment(uint256 by)",
]);

// ===== 连接网络 =====
const { viem } = await network.connect({
  network: NETWORK,
  chainType: "l1",
});

const publicClient = await viem.getPublicClient();
const [walletClient] = await viem.getWalletClients();

console.log("📍 当前账户:", walletClient.account.address);
console.log("📜 合约地址:", COUNTER_ADDRESS);
console.log();

// ===== 方法一：使用 viem.getContractAt (推荐) =====
console.log("=== 方法一：使用 viem.getContractAt ===\n");

const counter = await viem.getContractAt("Counter", COUNTER_ADDRESS);

// 读取合约状态（不消耗 gas）
console.log("📖 读取 x 的当前值:");
const currentValue = await counter.read.x();
console.log(`   x = ${currentValue}\n`);

// 写入合约状态（消耗 gas）
console.log("✍️  调用 inc() 函数:");
const incTxHash = await counter.write.inc();
console.log(`   交易哈希: ${incTxHash}`);

await publicClient.waitForTransactionReceipt({ hash: incTxHash });
console.log("   ✅ 交易已确认\n");

// 再次读取
const newValue = await counter.read.x();
console.log(`📊 新的 x 值: ${newValue}\n`);

// 调用带参数的函数
console.log("✍️  调用 incBy(5):");
const incByTxHash = await counter.write.incBy([5n]);
console.log(`   交易哈希: ${incByTxHash}`);

await publicClient.waitForTransactionReceipt({ hash: incByTxHash });
console.log("   ✅ 交易已确认\n");

const finalValue = await counter.read.x();
console.log(`📊 最终 x 值: ${finalValue}\n`);

// ===== 方法二：使用 viem 的 getContract =====
console.log("=== 方法二：使用 viem 的 getContract ===\n");

const counterContract = getContract({
  address: COUNTER_ADDRESS,
  abi: COUNTER_ABI,
  client: { public: publicClient, wallet: walletClient },
});

// 读取
const value2 = await counterContract.read.x();
console.log(`📖 通过 getContract 读取 x: ${value2}\n`);

// 写入
console.log("✍️  通过 getContract 调用 inc():");
const tx2 = await counterContract.write.inc();
console.log(`   交易哈希: ${tx2}\n`);

// ===== 方法三：手动编码函数调用（底层方法） =====
console.log("=== 方法三：手动编码函数调用 ===\n");

// 编码函数调用数据
const incData = encodeFunctionData({
  abi: COUNTER_ABI,
  functionName: "inc",
});

console.log("🔧 编码后的 inc() 调用数据:", incData);

// 使用编码后的数据发送交易
const tx3 = await walletClient.sendTransaction({
  to: COUNTER_ADDRESS,
  data: incData,
});

console.log(`📝 交易哈希: ${tx3}\n`);

// 编码带参数的函数
const incBy10Data = encodeFunctionData({
  abi: COUNTER_ABI,
  functionName: "incBy",
  args: [10n],
});

console.log("🔧 编码后的 incBy(10) 调用数据:", incBy10Data, "\n");

// ===== 方法四：使用完整的 ABI JSON =====
console.log("=== 方法四：从编译产物导入完整 ABI ===\n");

// 导入完整的编译产物
const counterArtifact = await import("../artifacts/contracts/Counter.sol/Counter.json", {
  assert: { type: "json" },
});

const counterWithFullAbi = getContract({
  address: COUNTER_ADDRESS,
  abi: counterArtifact.default.abi,
  client: { public: publicClient, wallet: walletClient },
});

const value4 = await counterWithFullAbi.read.x();
console.log(`📖 使用完整 ABI 读取 x: ${value4}\n`);

// ===== 查询历史事件 =====
console.log("=== 查询合约事件 ===\n");

try {
  const blockNumber = await publicClient.getBlockNumber();
  const events = await publicClient.getContractEvents({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    eventName: "Increment",
    fromBlock: blockNumber - 10n, // 查询最近 10 个区块（减少查询范围避免 RPC 限制）
    toBlock: blockNumber,
  });

  console.log(`📋 找到 ${events.length} 个 Increment 事件:`);
  events.forEach((event, index) => {
    console.log(`   事件 ${index + 1}: 增加了 ${event.args.by}`);
  });
} catch (error: any) {
  console.log("⚠️  查询事件失败（公共 RPC 节点限制）");
  console.log("   提示：使用付费 RPC 服务（如 Ankr、QuickNode）可以查询更多数据");
}

console.log("\n✨ 调用完成！");

