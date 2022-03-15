const caller = artifacts.require("Caller");
const calledLib = artifacts.require("CalledLibrary");

module.exports = function (deployer) {
  deployer.link(caller, calledLib);
  deployer.deploy(caller);
};
