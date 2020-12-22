//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./IRBBRegistry.sol";

contract Notarizer {
    IRBBRegistry public rbbRegistry;

    struct NotarizationInfo
    {
        bytes32 docHash;
        uint    notarizationDate;
    }

    // Attester RBB Id => Document metadata => Document Id => NotarizationInfo array.
    // Each element of the array is a version of the document.
    mapping (uint => mapping (string => mapping(string => NotarizationInfo[]))) 
        private notarizationInfos;

    // Attester RBB Id, document metadata, document id, document hash, notarization date, version
    event DocumentNotarized(uint, string, string, bytes32, uint, uint);

    constructor (address rbbRegistryAddr) public
    {
        rbbRegistry = IRBBRegistry (rbbRegistryAddr);
    }

    function notarizeDocument (string memory docMetadata, string memory docId, 
        bytes32 docHash) public 
    {
        uint attesterId = rbbRegistry.getId(msg.sender);
        uint notarizationDate = now; 

        notarizationInfos[attesterId][docMetadata][docId]
            .push(NotarizationInfo(docHash, notarizationDate));

        uint numberOfVersions = notarizationInfos[attesterId][docMetadata][docId].length;

        // Attester RBB Id, document metadata, document id, document hash, notarization date, version
        emit DocumentNotarized(attesterId, docMetadata, docId, docHash, 
            notarizationDate, numberOfVersions);
    }

    function isNotarizedDocument(uint attesterId, string memory docMetadata, string memory docId, 
        bytes32 docHash) public view returns (bool)
    {
        uint numberOfVersions = notarizationInfos[attesterId][docMetadata][docId].length;

        return (numberOfVersions == 0) ? 
            false : 
            (notarizationInfos[attesterId][docMetadata][docId][numberOfVersions - 1].docHash == docHash);
    }

    // Retorna um boolean que indica se há informacao disponivel e, caso true, 
    // retorna todos os hashs e as datas das notarizacoes em ordem de versao
    function notarizationInfoByData(uint attesterId, string memory docMetadata, 
        string memory docId) public view returns(bool, bytes32[] memory, uint[] memory)
    {

        uint length = notarizationInfos[attesterId][docMetadata][docId].length;
        bool existNotarization = (length > 0);

        bytes32[] memory    hashs = new bytes32[](length);
        uint[] memory      dates = new uint[](length);

        if (existNotarization)
        {
            for (uint i = 0; i < length; i++)
            {
                hashs[i] = notarizationInfos[attesterId][docMetadata][docId][i].docHash; 
                dates[i] = notarizationInfos[attesterId][docMetadata][docId][i].notarizationDate;
            }            
        }

        return (existNotarization, hashs, dates);

    }

}
