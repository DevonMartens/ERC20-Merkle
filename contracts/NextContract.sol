// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NextContract is ERC20, Ownable  {
    //storage for root value passed into constructor
    bytes32 public root;

     // let address = "0x..." // The input  
    // let hashedAddress = keccak256(address)
    // let proof = merkleTree.getHexProof(hashedAddress)   

     // address[] entireAllowList;
     //default is falsae
     mapping(address => bool)allowList;


    constructor(bytes32 _root) ERC20("DevonIsADeveloper", "HIRE") {
        root = _root;
    }

    //generall the proof should be passed into the front end. Will add an example in this folder
   

     function mintToken(address to, address reciever, bytes32[] memory proof) external {
        require(!allowList[to], 'Already_claimed.');
        require(isValid(proof, keccak256(abi.encodePacked(to))), "INVALID_ADDRESS");
        _mint(reciever, 100);
    }

 
  

     function isValid(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }
}