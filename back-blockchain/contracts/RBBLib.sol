pragma solidity ^0.5.0;

library RBBLib {

  function isEqual(string memory a, string memory b) public pure returns (bool) {
    bool r = keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    return r;
  }
}