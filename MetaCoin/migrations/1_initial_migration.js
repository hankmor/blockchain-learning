// 这是一个部署脚本，用来部署 Migrations 合约，对应 Migrations.sol 文件。

const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
};
