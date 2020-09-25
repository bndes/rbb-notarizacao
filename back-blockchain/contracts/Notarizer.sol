//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

import "./RBBRegistry.sol";

contract Notarizer {

    RBBRegistry public rbbRegistry;

    // Constant that indicates that the document notarization was revoked
    uint public NOTARIZATION_REVOKED = 0;

    // Constant that indicates that the document never expires
    uint public NEVER_EXPIRES = 0;


    struct NotarizationInfo {
        // Notarization date (0 means "not verified")
        uint notarizationDate;
        // Verification expiration date (0 means "never expires")
        uint expirationDate;
    }

    // Attester RBB Id => Document hash => notarizationInfo
    mapping (uint => mapping (uint256 => NotarizationInfo)) private notarizationInfo;

    // Document hash, attester RBB Id, date of today and expiration date
    event DocumentNotarized(uint, uint256, uint, uint);
    event NotarizationRevoked(uint, uint256, uint);

    constructor (address rbbRegistryAddr) public
    {
        rbbRegistry = RBBRegistry (rbbRegistryAddr);
    }

    function notarizeDocument(uint256 hash) public 
    {
        notarizeDocumentWithExpirationDate(hash, NEVER_EXPIRES);
    }

    function notarizeDocumentWithExpirationDate(uint256 hash, uint validDays) public 
    {        
        uint expirationDate = validDays > 0 ? now + validDays * 1 days : NEVER_EXPIRES;
        uint attesterRbbId = rbbRegistry.getId(msg.sender);
 
        notarizationInfo[attesterRbbId][hash] = NotarizationInfo(now, expirationDate);

        emit DocumentNotarized(attesterRbbId, hash, now, expirationDate);
    }

    function isNotarizedDoc(uint attesterId, uint256 hash) public view returns (bool)
    {
        return isNotarizedAndNotExpiredDoc(attesterId, hash);
    }

    function isNotarizedAndNotExpiredDoc(uint attesterId, uint256  hash) public view returns (bool)
    {
        NotarizationInfo memory docInfo = notarizationInfo[attesterId][hash];
        return ((docInfo.notarizationDate != 0) && 
            ((docInfo.expirationDate >= now) || (docInfo.expirationDate == NEVER_EXPIRES)));
    }

    function isNotarizedButExpiredDoc(uint attesterId, uint256 hash) public view returns (bool)
    {
        NotarizationInfo memory docInfo = notarizationInfo[attesterId][hash];
        return ((docInfo.notarizationDate != 0) && (docInfo.expirationDate < now));
    }

    function revoke(uint256  hash) public 
    {
        uint attesterRbbId = rbbRegistry.getId(msg.sender);

        notarizationInfo[attesterRbbId][hash] = 
            NotarizationInfo(NOTARIZATION_REVOKED, NOTARIZATION_REVOKED);

        emit NotarizationRevoked(attesterRbbId, hash, now);
    }
}