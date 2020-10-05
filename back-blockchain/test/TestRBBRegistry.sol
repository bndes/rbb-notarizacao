pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RBBRegistry.sol";

contract TestRBBRegistry {

  function testRBBRegistryCreation() public {
    RBBRegistry registry = new RBBRegistry(1000);

    Assert.equal(registry.getId(address(this)), 1000, "Owner should have identification of 10000");
  }
/*
  function testInitialBalanceWithNewMetaCoin() public {
    MetaCoin meta = new MetaCoin();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }
*/
}