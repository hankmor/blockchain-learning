// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// 盲拍竞价合约示例。

contract BlindAuction {
    // 竞拍对象
    struct Bid {
        // 盲拍的参数，blindedBid = keccak256(value, fake, secret)
        bytes32 blindedBid;
        // 出资金额
        uint deposit;
    }

    // 竞拍参数
    address payable public beneficiary;
    // 竞拍结束时间（秒）
    uint public biddingEnd;
    // 公示结束时间（秒）
    uint public revealEnd;
    // 结束标志
    bool public ended;

    // 地址到多个出价的映射，一个地址可以多次出价
    mapping(address => Bid[]) public bids;

    // 最高出价的地址
    address public highestBidder;
    // 最高出价金额
    uint public highestBid;

    // 可以取回的之前的出价
    mapping(address => uint) pendingReturns;

    event AuctionEnded(address winner, uint highestBid);

    /// 使用 modifier 可以更便捷的校验函数的入参。
    /// `onlyBefore` 会被用于后面的 `bid` 函数：
    /// 新的函数体是由 modifier 本身的函数体，并用原函数体替换 `_;` 语句来组成的。
    modifier onlyBefore(uint _time) {
        require(block.timestamp < _time);
        _;
    }
    modifier onlyAfter(uint _time) {
        require(block.timestamp > _time);
        _;
    }

    // 构造器
    constructor(uint _biddingTime, uint _revealTime, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        // 竞拍截止时间（秒）
        biddingEnd = block.timestamp + _biddingTime;
        // 竞拍结束后的公示时间（秒）
        revealEnd = biddingEnd + _revealTime;
    }

    /// 可以通过 `_blindedBid` = keccak256(value, fake, secret) 设置一个秘密竞拍。
    /// 只有在出价公示阶段被正确公示，已发送的以太币才会被退还。
    /// 如果与出价一起发送的以太币至少为 “value” 且 “fake” 不为真，则出价有效。
    /// 将 “fake” 设置为 true ，然后发送满足订金金额但又不与出价相同的金额是隐藏实际出价的方法。
    /// 同一个地址可以放置多个出价。
    function bid(bytes32 _blindedBid) public payable onlyBefore(biddingEnd) {
        // 向竞拍对象数组中存入新的竞拍对象
        bids[msg.sender].push(Bid({
        blindedBid : _blindedBid, // 秘密竞拍参数设置
        deposit : msg.value // 出价的以太币金额
        }));
    }

    /// 公示你的秘密竞拍出价。
    /// 对于所有正确公示的无效出价以及除最高出价以外的所有出价，你都将获得退款。
    function reveal(uint[] _values, bool[] _fake, bytes32[] _secret) public onlyAfter(biddingEnd) onlyBefore(revealEnd) {
        uint length = bids[msg.sender].length;
        require(_values.length == length);
        require(_fake.length == length);
        require(_secret.length == length);

        uint refund;
        for (uint i = 0; i < length; i++) {
            Bid storage bid = bids[msg.sender][i];
            (uint value, bool fake, bytes32 secret) = (_values[i], _fake[i], _secret[i]);
            if (bid.blindedBid != keccak256(value, fake, secret)) {
                // 出价未能正确披露
                // 不返还订金
                continue;
            }
            refund += bid.deposit;
            if (!fake && bid.deposit >= value) {
                if (placeBid(msg.sender, value))
                    refund -= value;
            }
            // 使发送者不可能再次认领同一笔订金
            bid.blindedBid = bytes32(0);
        }
        msg.sender.transfer(refund);
    }

    // 这是一个 "internal" 函数， 意味着它只能在本合约（或继承合约）内被调用
    function placeBid(address bidder, uint value) internal returns (bool success) {
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != address(0)) {
            // 返还之前的最高出价
            pendingReturns[highestBidder] += highestBid;
        }
        highestBid = value;
        highestBidder = bidder;
        return true;
    }

    /// 取回出价（当该出价已被超越）
    function withdraw() public {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // 这里很重要，首先要设零值。
            // 因为，作为接收调用的一部分，
            // 接收者可以在 `transfer` 返回之前重新调用该函数。（可查看上面关于‘条件 -> 影响 -> 交互’的标注）
            pendingReturns[msg.sender] = 0;

            msg.sender.transfer(amount);
        }
    }

    /// 结束拍卖，并把最高的出价发送给受益人
    function auctionEnd() public onlyAfter(revealEnd) {
        require(!ended);
        emit AuctionEnded(highestBidder, highestBid);
        ended = true;
        beneficiary.transfer(highestBid);
    }
}
