//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

import "./RBBRegistry.sol";

contract NotarizerWithData {
    RBBRegistry public rbbRegistry;

    /*
        Constants to be usesd when both document type or the document id 
        are not relevant for the user
    */
    string public EMPTY_DOCUMENT_TYPE;
    string public EMPTY_DOCUMENT_ID:

    // Owner RBB Id => Document type => Document Id => Document hash 
    mapping (uint => mapping (string => mapping(string => uint256))) 
        private notarizedHash;

    // Document hash, attester RBB Id, date of today and expiration date
    event DocumentNotarized(uint, string, string, uint256, uint256);

    constructor (address rbbRegistryAddr) public
    {
        rbbRegistry = RBBRegistry (rbbRegistryAddr);
    }

    

}
