// SPDX-License-Identifier: MIT

pragma solidity >=0.4.25 <0.7.0;

// 单独的 Solidity 文件，用来管理和升级智能合约. 每一个工程都有这样的一个文件，并且通常不需要编辑它。

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
