const RBBRegistry = artifacts.require("RBBRegistry");
const Notarizer = artifacts.require("Notarizer");
const BNDESPublicTenderNotarizer = artifacts.require("BNDESPublicTenderNotarizer");

module.exports = function(deployer) {
  deployer.deploy(RBBRegistry, 1000)
  .then(() => deployer.deploy(Notarizer, RBBRegistry.address));
};
