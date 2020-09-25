const RBBRegistry = artifacts.require("RBBRegistry");
const Notarizer = artifacts.require("Notarizer");
const BNDESPublicTenderNotarizer = artifacts.require("BNDESPublicTenderNotarizer");

module.exports = function(deployer) {
  deployer.deploy(RBBRegistry, 1000)
  .then(() => deployer.link(RBBRegistry, Notarizer))
  .then(() => deployer.deploy(Notarizer, RBBRegistry.address))
  .then(() => deployer.link(RBBRegistry, BNDESPublicTenderNotarizer))
  .then(() => deployer.deploy(BNDESPublicTenderNotarizer, RBBRegistry.address));
};
