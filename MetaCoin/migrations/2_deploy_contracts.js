// 这是一个部署脚本，用来部署 MetaCoin 合约. (部署脚本的运行是有顺序的，以2开头的脚本通常在以1开头的脚本之后运行)

const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");

module.exports = function (deployer) {
    deployer.deploy(ConvertLib);
    deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(MetaCoin);
};
