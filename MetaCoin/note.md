使用Truffle构建的区块链示例工程.

## 文档地址

* 官方文档：https://trufflesuite.com/docs/truffle/quickstart.html
* 中文文档：https://learnblockchain.cn/docs/truffle/

## 工程目录结构

* contracts: Solidity合约目录
* migrations: 部署脚本文件目录
* test: 测试脚本目录
* truffle-config.js: Truffle 配置文件

## 测试

1. 进入 MetaCoin 目录
2. 执行 `truffle test ./test/TestMetacoin.sol`，此时开始编译合约并启动测试，最终输出：

```shell
Compiling your contracts...
===========================
> Compiling ./contracts/ConvertLib.sol
> Compiling ./contracts/MetaCoin.sol
> Compiling ./contracts/Migrations.sol
> Compiling ./test/TestMetaCoin.sol
> Artifacts written to /var/folders/8b/y3pklwbs1wj_cq7hm_yjwgpr0000gn/T/test--17539-nyx5vf4Fm5p0
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang

  TestMetaCoin
    ✓ testInitialBalanceUsingDeployedContract (1073ms)
    ✓ testInitialBalanceWithNewMetaCoin (1073ms)

  2 passing (22s)
```

3. 运行 JavaScript 测试用例，执行 `ruffle test ./test/metacoin.js`，输出如下：

```shell
Compiling your contracts...
===========================
> Compiling ./contracts/ConvertLib.sol
> Compiling ./contracts/MetaCoin.sol
> Compiling ./contracts/Migrations.sol
> Artifacts written to /var/folders/8b/y3pklwbs1wj_cq7hm_yjwgpr0000gn/T/test--17627-dZM84zbMXKiM
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang

  Contract: MetaCoin
    ✓ should put 10000 MetaCoin in the first account
    ✓ should call a function that depends on a linked library
    ✓ should send coin correctly (1090ms)

  3 passing (1s)
```

## 编译智能合约

执行如下命令编译：`truffle compile`，输出如下：

```shell
Compiling your contracts...
===========================
> Compiling ./contracts/ConvertLib.sol
> Compiling ./contracts/MetaCoin.sol
> Compiling ./contracts/Migrations.sol
> Artifacts written to /Users/sam/workspace/mine/blockchain/blockchain-learning/MetaCoin/build/contracts
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang
```

## 使用 Truffle Develop 部署合约

为了部署我们的合约，我们需要连接到区块链网络。

Truffle 提供了一个内置的个人模拟区块链，它可以帮助我们用来测试。注意，这个区块链是内置在我们本地的系统里面，它不和以太坊的组网进行连接。

我们可以使用Truffle Develop来创建区块链，并与之交互。使用 `truffle develop` 启动模拟区块链，输出：

```shell
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0x6f719872ba1cf8613303a888a2ac3e3b636b9361
(1) 0x31abeabf9493d172efa61e1e6997c68de2cca91a
(2) 0xc8a66d382fe38f4d21b129e771302830039bb98e
(3) 0x9ec06c8117aec8436ab179fc0089e2cab338c7c4
(4) 0x7e0f0579f757b5c7fcb85f448277c3830223edae
(5) 0xe4940362d1b621e0c49cb7a7e24361fde9828030
(6) 0x3e9067470b4857ddaafeaf132627bd524d77ed05
(7) 0xa3b8942a30a9ee61d209d4978d6dc376f768be59
(8) 0x885fdac354dee51b863f3ca41fbecf75b24907a7
(9) 0xb5b712c53711724fdd9cecc5d7bac471df227b6a

Private Keys:
(0) 6d6d62cdf74512e7b2822ff71374413ae76e084f6ce6124ecd3aaab833f6bbf6
(1) fc08a8a54786a07be7f70ce47e74f03c0163b46404baa1802268326c041d4d14
(2) 0a2f57b218efb648f23a5333d31b90304708a66c81a805c2af6f4734cdaeaf9b
(3) 77bb2733ae47a9e351b08002490c3e0a3b5bdc888313a27e40fe825cf1dc5c29
(4) 7257eba9dbf6dab1ece8da217ebb85244099d9caac53fa11575efaecfef2c823
(5) 614fb6430f7c2407e3e78663fb60c6723d747bcde4a2659a99098e6accba2ba1
(6) 5389d61f6f1f8b3f18a21d907daf87e8061f2a1300f87be66c987b7525068ee1
(7) ca91b497488a799ba4679d0c461d3fa448f6d570a9c86c4063a7aa22e370199d
(8) 53cc5c331ea0ba0c48cfbef43dc117a32de921b7a2757fee13917a7bd94cbb05
(9) d5ae513c927b1e3938e36e9d257f7b1f34ecca8d1662fd5a14abc454abc2e294

Mnemonic: feature girl hour puzzle goat obscure life fitness dentist horse virtual there

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
Ensure you do not use it on production blockchains, or else you risk losing funds.
```

MacOS 或 Linux 提示没有写入文件夹的权限请使用 `sudo`。

然后，可以直接在命令提示符下使用 truffle 命令，此时可以不带 `truffle` 前缀。比如，编译智能合约直接输入 `compile` 即可：

```shell
truffle(develop)> compile

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.
```

部署智能合约：

```shell
truffle(develop)> migrate

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

Starting migrations...
======================
> Network name:    'develop'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x3b2c0ac5d428eb7f4471c1f940d3e4311a963d34f81476c09918de7b2ef8d38b
   > Blocks: 0            Seconds: 0
   > contract address:    0x71176B208F46BfbDd60dCDAea31EEA86Dc09384a
   > block number:        1
   > block timestamp:     1644998319
   > account:             0x6f719872bA1Cf8613303a888a2Ac3E3b636b9361
   > balance:             99.999441521875
   > gas used:            165475 (0x28663)
   > gas price:           3.375 gwei
   > value sent:          0 ETH
   > total cost:          0.000558478125 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:      0.000558478125 ETH


2_deploy_contracts.js
=====================

   Deploying 'ConvertLib'
   ----------------------
   > transaction hash:    0x6bfe59a5347389c5d91c8c0f103aaf86d2df42b35942ac210c47b71170ac542d
   > Blocks: 0            Seconds: 0
   > contract address:    0x4BBfAc869278C9AC80F24847D2F433DeF68646b8
   > block number:        3
   > block timestamp:     1644998319
   > account:             0x6f719872bA1Cf8613303a888a2Ac3E3b636b9361
   > balance:             99.998988695105073555
   > gas used:            95470 (0x174ee)
   > gas price:           3.175945351 gwei
   > value sent:          0 ETH
   > total cost:          0.00030320750265997 ETH


   Linking
   -------
   * Contract: MetaCoin <--> Library: ConvertLib (at address: 0x4BBfAc869278C9AC80F24847D2F433DeF68646b8)

   Deploying 'MetaCoin'
   --------------------
   > transaction hash:    0x0782d28d8d0375e2eabb45f1f39e10465c1a3b939b2b5dc9f0c385d5c7ad7de2
   > Blocks: 0            Seconds: 0
   > contract address:    0xcbe830447ef3F9810074C6f5d05E25B7A69ac9ee
   > block number:        4
   > block timestamp:     1644998319
   > account:             0x6f719872bA1Cf8613303a888a2Ac3E3b636b9361
   > balance:             99.998095608248213955
   > gas used:            288665 (0x46799)
   > gas price:           3.09385224 gwei
   > value sent:          0 ETH
   > total cost:          0.0008930868568596 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.00119629435951957 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.00175477248451957 ETH


- Blocks: 0            Seconds: 0
- Saving migration to chain.
- Blocks: 0            Seconds: 0
- Blocks: 0            Seconds: 0
- Saving migration to chain.
```

可以看到显示了每一个智能合约部署的结果信息，包括 交易hash值、区块高度(block number)、合约地址(contract address) 以及消耗的 gas 等等。

如果需要退出 truffle 控制台，输入 `.exit` 即可。

## 通过 Ganache 部署

另一个更直观的本地模拟区块链的方式是 ganache，与 `truffle develop` 功能相同，只是它自带图形化界面，只是在 truffle 工程中需要额外配置 ganache 的地址。

1. 从 truffle 官方下载 ganache 并安装，然后启动它。
2. 在 truffle 工程中配置地址, 编辑 `truffle-config.js`，添加如下配置：

```javascript
module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        }
    }
};
```

host 和 port 配置 ganache 的连接地址和端口。

3. 然后，通过控制台命令来部署合约：
   
```shell
truffle migrate
```

4. 然后可以在ganache中看到合约部署的信息。
