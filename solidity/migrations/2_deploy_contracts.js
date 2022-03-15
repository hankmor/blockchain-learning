const calledContract = artifacts.require("CalledContract");
const calledLibrary= artifacts.require("CalledLibrary");
const caller = artifacts.require("Caller");

module.exports = function (deployer) {
  deployer.deploy(calledLibrary);
  deployer.deploy(calledContract);
  deployer.link(calledLibrary, caller);
  deployer.link(calledContract, caller);
  deployer.deploy(caller);
};
