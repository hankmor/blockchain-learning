// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract CalledContract {
    event CallEvent(address sender, address origin, address from);

    function calledFunction() public {
        emit CallEvent(msg.sender, tx.origin, address(this));
    }
}

library CalledLibrary {
    event CallEvent(address sender, address origin, address from);

    function calledFunction() public {
        emit CallEvent(msg.sender, tx.origin, address(this));
    }
}

contract Caller {
    function calls(CalledContract _calledContract) public {
        // 使用 call 直接调用 CalledContract 的方法
        _calledContract.calledFunction();
        CalledLibrary.calledFunction();

        // 使用 delegatecall 调用它们
        (bool success, bytes memory result) = address(_calledContract).delegatecall(abi.encode(bytes4(keccak256("calledFunction()"))));
        require(success);
        (bool success1, bytes memory result1) = address(CalledLibrary).delegatecall(abi.encode(bytes4(keccak256("calledFunction()"))));
        require(success1);
    }
}
