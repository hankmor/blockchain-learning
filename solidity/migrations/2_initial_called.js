const calledContract = artifacts.require("CalledContract");

module.exports = function (deployer) {
  deployer.deploy(calledContract);
};
