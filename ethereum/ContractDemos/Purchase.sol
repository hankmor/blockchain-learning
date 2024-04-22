// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0  <0.9.0;

// 买卖合约示例，通过状态机来实现买卖双方的确认机制。

contract Purchase {
    uint public value;
    address payable public seller;
    address payable public buyer;

    enum State {Created, Locked, Release, Inactive}

    State public state;

    // 条件限制
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    // 调用者限制为买家
    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Only buyer can call this."
        );
        _;
    }

    // 调用者限制为卖家
    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    // 状态限制，符合状态才能继续调用
    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    // 事件定义

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();
    event SellerRefunded();

    //确保 `msg.value` 是一个偶数。
    //如果它是一个奇数，则它将被截断。
    //通过乘法检查它不是奇数。
    constructor() payable {
        seller = payable(msg.sender);
        value = msg.value / 2;
        require((2 * value) == msg.value, "Value has to be even.");
    }


    ///中止购买并回收以太币。
    ///只能在合约被锁定之前由卖家调用。
    function abort() public onlySeller inState(State.Created) {
        emit Aborted();
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }

    /// 买家确认购买。
    /// 交易必须包含 `2 * value` 个以太币。
    /// 以太币会被锁定，直到 confirmReceived 被调用。
    function confirmPurchase() public inState(State.Created) condition(msg.value == (2 * value)) payable {
        emit PurchaseConfirmed();
        buyer = payable(msg.sender);
        state = State.Locked;
    }

    /// 买家确认已经收到商品。
    /// 这会释放被锁定的以太币。
    function confirmReceived() public onlyBuyer inState(State.Locked) {
        emit ItemReceived();
        // 必须首先更改状态，然后调用transfer，避免transfer被调用多次
        state = State.Release;

        buyer.transfer(value);
    }

    /// 退款给卖家，即：将锁定的资金发给卖家
    function refundSeller() public onlySeller inState(State.Release) {
        emit SellerRefunded();
        // 必须先更改状态，然后调用transfer，避免多次调用
        state = State.Inactive;

        seller.transfer(3 * value);
    }
}
