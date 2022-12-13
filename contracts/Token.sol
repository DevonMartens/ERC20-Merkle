// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Token is ERC20, Ownable {
    //storage for root value passed into constructor
    bytes32 public root;


    constructor(bytes32 _root) ERC20("DevonIsADeveloper", "HIRE") {
        root = _root;
    }

    //generall the proof should be passed into the front end. Will add an example in this folder
     function mintToken(bytes32[] memory proof) external {
        require(isValid(proof, keccak256(abi.encodePacked(msg.sender))), "INVALID_ADDRESS");
        _mint(msg.sender, 1);
    }


    //proof sent in as path to the root
    //leaf is an address
    //returns bool that checks validity after calling verify from
    function isValid(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }
}