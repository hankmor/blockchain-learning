call.sol合约：测试合约的 call 和delegatecall 调用的 msg.sender、tx.origin、this 的变化情况。

1、启动truffle

```shell
$ truffle develop
```

2、执行合约部署

```shell
truffle(develop)> migrate
```
部署完成后可以看到合约的地址信息。

3、查看合约地址：

```shell
truffle(develop)> CalledContract.address
'...'
truffle(develop)> CalledLibrary.address
'...'
truffle(develop)> Caller.address
'...'
```

查看所有账号：

```shell
truffle(develop)> web3.eth.getAccounts()
```

部署合约的账号就是第一个

4、调用行为测试

1）先创建Caller合约的实例：

```shell
truffle(develop)> caller = await Caller.deployed()
```

2）发起合约方法调用，传入 CalledContract 合约的地址

```shell
truffle(develop)> caller.calls(CalledContract.address).then(res => {res.logs.forEach(log => {console.log(log.args)})})
```

从结果可以看到：

1、地址(addr)调用合约（A），合约A再调用合约（B）：

1）如果从合约地址直接调用合约的方法，即：

```solidity
_calledContract.calledFunction();
```

* `msg.sender` 为调用合约A的地址
* `tx.origin` 为最初发起调用的地址addr的地址
* `this` 为被调用合约B的地址

2）如果被调用合约B是一个Library，那么：

```solidity
 CalledLibrary.calledFunction();
```

* `msg.sender` 为调用合约A的地址addr
* `tx.origin` 为调用合约A的地址addr
* `this` 不是被调用合约B的地址，而是调用合约A的地址

2、地址(addr)调用合约（A），合约A再使用call、delegatecall、staticcall 调用合约（B）：

> 函数 call，delegatecall 和 staticcall 。 它们都带有一个 bytes memory 参数和返回执行成功状态（bool）和数据（bytes memory）。
>
> 函数 abi.encode，abi.encodePacked，abi.encodeWithSelector 和 abi.encodeWithSignature 可用于编码结构化数据。
> 
> 为了与不符合 应用二进制接口Application Binary Interface(ABI) 的合约交互，于是就有了可以接受任意类型任意数量参数的 call 函数


> 在以太坊家园（homestead） 之前，只有 callcode 函数，它无法访问原始的 msg.sender 和 > msg.value 值。 此函数已在0.5.0版中删除。


1）call

> 底层发起合约调用。



2）delegatecall

> 函数 delegatecall ：与 call 的区别在于只调用给定地址的代码（函数），其他状态属性如（存储，余额 …）都来自当前合约。 delegatecall 的目的是使用另一个合约中的库代码。 用户必须确保两个合约中的存储结构都适合委托调用 （delegatecall）。

调用合约：

```solidity
address(_calledContract).delegatecall(abi.encode(bytes4(keccak256("calledFunction()"))))
```

* `msg.sender` 为调用合约A的地址addr
* `tx.origin` 为调用合约A的地址addr
* `this` 不是被调用合约B的地址，而是调用合约A的地址

调用库合约：

```solidity
address(CalledLibrary).delegatecall(abi.encode(bytes4(keccak256("calledFunction()"))))
```

* `msg.sender` 为调用合约A的地址addr
* `tx.origin` 为调用合约A的地址addr
* `this` 不是被调用合约B的地址，而是调用合约A的地址

可以看到，delegatecall 调用合约跟库合约都是一样的，相当于把合约的代码放到自己中调用。

3）staticcall

> 从以太坊拜占庭（byzantium）版本开始 提供了 staticcall ，它与 call 基本相同，但如果被调用的函数以任何方式修改状态变量，都将回退。


总结：
1、合约通过地址调用其他合约，tx.origin 是最初发起调用的地址，msg.sender 是发起调用的合约，内部的this指的是被调用合约本身
2、合约调用库合约(library)，相当于将库合约代码合并到本身，tx.origin是最初调用合约的地址，msg.sender是谁调用合约，this是合约
3、call的行为与直接调用合约方法相同
4、delegatecall 无论调用合约还是库合约，都与调用库合约的行为一样
5、staticcall与call相同，区别在于不能更改合约的状态
