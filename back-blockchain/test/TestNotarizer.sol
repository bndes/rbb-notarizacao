pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Notarizer.sol";
import "../contracts/RBBRegistry.sol";
import "../contracts/Notarizer.sol";

contract TestNotarizer {

    Notarizer notarizer;

    RBBRegistry registry;
    uint registryId = 0;
    bytes32 mockedHash = keccak256(abi.encodePacked("1")); 

    mapping (uint => uint[]) exemplo;

    function getRegistryId() internal returns (uint)
    {
        if (registryId == 0)
        {
            registryId = registry.getId(address(this));
        }
        return registryId;
    }

    function newMockedHash () internal returns (bytes32)
    {
        mockedHash = keccak256(abi.encodePacked(mockedHash));
        return mockedHash;
    }

    function getMockedHash () view internal returns (bytes32)
    {
        return mockedHash;
    }

    function testNotarizerCreation() public 
    {
        uint        registryOwnerId = 1000;
        address     registryOwnerAddr = address(this); // White box - we know this contract will be the owner

        registry = new RBBRegistry(registryOwnerId);

        notarizer = new Notarizer(address(registry));

        Assert.equal(notarizer.rbbRegistry().getId(registryOwnerAddr), registryOwnerId, 
            "Criação do Notarizer falhou - Id do owner do rbbRegistry obtido do Notarizer diferente do esperado");
    }

    function testNotarizeWithMetadataCreation() public
    {
        uint        registryOwnerId = 1000;
        address     registryOwnerAddr = address(this); // White box - we know this contract will be the owner

        registry = new RBBRegistry(registryOwnerId);

        notarizer = new Notarizer(address(registry));

        Assert.equal(notarizer.rbbRegistry().getId(registryOwnerAddr), registryOwnerId, "Criação do Notarizer falhou - Id do owner do rbbRegistry obtido do Notarizer diferente do esperado");

    }

    function testNotarization() public
    {
        string memory METADATA = "metadata";
        string memory ID       = "id";

        // Notariza
        bytes32 HASH_01 = newMockedHash();
        notarizer.notarizeDocument (METADATA, ID, HASH_01);

        Assert.isTrue(notarizer.isNotarizedDocument(getRegistryId(), METADATA, ID, HASH_01), 
            "Documento notarizado não foi confirmado como tendo sido notarizado");

        bytes32 HASH_02 = newMockedHash();
        Assert.isFalse(notarizer.isNotarizedDocument(getRegistryId(), METADATA, ID, HASH_02),
            "Reconheceu como notarizado um documento que não havia sido notarizado");

        // Notariza outra versão do mesmo documento
        bytes32 HASH_03 = newMockedHash();
        notarizer.notarizeDocument(METADATA, ID, HASH_03);

        Assert.isTrue(notarizer.isNotarizedDocument(getRegistryId(), METADATA, ID, HASH_03),
            "Documento notarizado como segunda versão não foi confirmado como notarizado");

        Assert.isFalse(notarizer.isNotarizedDocument(getRegistryId(), METADATA, ID, HASH_01),
            "Documento notarizado em versão mais antiga foi reconhecido como sendo notarizado");

        bool notarized;
        bytes32[] memory hashs;
        uint[] memory dates;
        (notarized, hashs, dates) = notarizer.notarizationInfoByData(getRegistryId(), METADATA, ID);    

        Assert.isTrue(notarized, "Busca de informações por metadados não encontrou resultado");

        Assert.equal(hashs[0], HASH_01, "Hash obtido de versão de notarização não bate com o obtido");

        Assert.equal(hashs[1], HASH_03, "Hash obtido não bate com o notarizado");

        Assert.equal(dates[0], now, "Data notarizada em versão antiga não bate");

        uint FALSE_RBB_ID = getRegistryId() + 1;
        string memory METADATA2 = "metadata2";
        bytes32 HASH_04 = newMockedHash();

        notarizer.notarizeDocument(METADATA, "id2", HASH_04);

        Assert.isTrue(notarizer.isNotarizedDocument(getRegistryId(), METADATA, "id2", HASH_04),
            "Documento notarizado com id diferente não encontrado");

        Assert.isFalse(notarizer.isNotarizedDocument(getRegistryId(), METADATA, "id3", HASH_04),
            "Documento não notarizado identificado como tendo sido notarizado");

        Assert.isFalse(notarizer.isNotarizedDocument(getRegistryId(), METADATA2, "id2", HASH_04),
            "Documento notarizado com outro metadado identificado como tendo sido notarizado");

        Assert.isFalse(notarizer.isNotarizedDocument(FALSE_RBB_ID, METADATA, "id2", HASH_04),
            "Documento notarizado sob outro RBB ID erroneamento dado como notarizado");
            
        (notarized, hashs, dates) = notarizer.notarizationInfoByData(getRegistryId(), 
            METADATA, "id2");    
        
        Assert.isTrue(notarized, "Chamada a notarizationInfoByData com resultado incorreto");

        Assert.equal(hashs.length, 1, "Chamada a notarizationInfoByData trazendo número de hashs notarizados incorreto");

        Assert.equal(dates.length, 1, "Chamada a notarizationInfoByData trazendo número de datas incorreto");

        Assert.equal(hashs[0], HASH_04, "Hash retornado na chamada a notarizationInfoByData incorreto");

    }
}