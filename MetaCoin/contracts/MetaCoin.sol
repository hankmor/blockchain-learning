// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

import "./ConvertLib.sol";

// 用 Solidity 编写的 MetaCoin 代币 智能合约。注意他还引用了目录下的另外一个合约文件 contracts/ConvertLib.sol 。

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
    // 定义地址到余额的映射状态变量
    mapping(address => uint) balances;

    // 定义转账事件
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // 构造函数
    constructor() public {
        balances[tx.origin] = 10000;
    }

    // 发币方法
    function sendCoin(address receiver, uint amount) public returns (bool sufficient) {
        // 判断余额
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        // 触发转账事件
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }

    // 查询货币余额，返回ether（以太币），按照兑换率兑换成ether
    function getBalanceInEth(address addr) public view returns (uint){
        return ConvertLib.convert(getBalance(addr), 2);
    }

    // 查询货币余额
    function getBalance(address addr) public view returns (uint) {
        return balances[addr];
    }
}
