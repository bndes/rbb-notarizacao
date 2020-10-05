//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract RBBRegistry  
{
    mapping (address => uint) private ids;

    constructor (uint id) public 
    {
        addId(msg.sender, id);
    
    }

    function addId(address addr, uint id) public
    {
        ids[addr] = id;
    }

    function getId (address addr) public view returns (uint) 
    {
        require(ids[addr] != 0, "Endereço não tem identificador associado no RBBRegistry");
        return ids[addr];
    }

}