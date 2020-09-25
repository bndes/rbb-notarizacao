pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Notarizer.sol";
import "../contracts/RBBRegistry.sol";

contract TestNotarizer {

    Notarizer notarizer;
    RBBRegistry registry;
    uint registryId = 0;
    uint256 mockedHash = 12345; 

    function getRegistryId() internal returns (uint)
    {
        if (registryId == 0)
        {
            registryId = registry.getId(address(this));
        }
        return registryId;
    }

    function newMockedHash () internal returns (uint256)
    {
        mockedHash++;
        return mockedHash;
    }

    function getMockedHash () view internal returns (uint256)
    {
        return mockedHash;
    }

    function testNotarizerCreation() public 
    {
        uint        registryOwnerId = 1000;
        address     registryOwnerAddr = address(this); // White box - we know this contract will be the owner

        registry = new RBBRegistry(registryOwnerId);

        notarizer = new Notarizer(address(registry));

        Assert.equal(notarizer.rbbRegistry().getId(registryOwnerAddr), registryOwnerId, "Criação do Notarizer falhou - Id do owner do rbbRegistry obtido do Notarizer diferente do esperado");
    }

    function testSimpleNotarization() public
    {
        notarizer.notarizeDocument(newMockedHash());

        Assert.isTrue(notarizer.isNotarizedDoc(getRegistryId(), getMockedHash()), 
            "Notarização de documento não reconhecida");
    }

    function testNotNotarization() public
    {
        Assert.isFalse(notarizer.isNotarizedDoc(getRegistryId(), newMockedHash()), 
            "Documento não notarizado reconhecido com notarizado");
    }

    function testNotarizationWithExpirationDate() public
    {
        notarizer.notarizeDocumentWithExpirationDate(newMockedHash(), 1);
        
        Assert.isTrue(notarizer.isNotarizedDoc(getRegistryId(), getMockedHash()),
            "Notarização com data de expiração não reconhecida");
    }
}