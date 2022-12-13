// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NextContract is ERC20, Ownable  {
    /**  
    ================================================
    |              STORAGE VARIABLES               |
    ================================================
    **/

    /*@Dev: Storage for root value passed into constructor - used in merkle proof.*/
    bytes32 public root;

    /*
    @Dev: Mapping to check if address has already recieved tokens.
    @Notice: The default is false.
    */
    mapping(address => bool) public _allowList;

    /**  
    ================================================
    |                CONSTRUCTOR                   |
    ================================================
    **/

    /*
    @Dev: Inputs for ERC20 and root.
    @Notice: ERC20 takes name and symbol.
    @Notice: A Merkle root is the hash of all the hashes of all the transactions that are part of a block in a blockchain network.
    For more information: https://www.investopedia.com/terms/m/merkle-root-cryptocurrency.asp
    @Notice: Mints 10k tokens, 100 for 100 addresses
    */


    constructor(bytes32 _root) ERC20("DevonIsADeveloper", "HIRE") {
        root = _root;
        _mint(address(this), 10000);
    }

    /**  
    ================================================
    |             Claim Functions                  |
    ================================================
    **/

    /*
    FUNCTION: transferToken
    @Dev: This function is meant to allow tokens to be claimed by the user but they can move them where ever they want.
    @Params: It takes in the `proof` which generally speaking we would calculate and be passing in on the front end to make things easier for users.
    @Params: It takes in two addresses `to` which is where we are ending the tokens and `merkleApprovedAddress`.
    */
   

     function transferToken(address to, address reciever, bytes32[] memory proof) external {
        require(!_allowList[to], 'Already_claimed.');
        require(isValid(proof, keccak256(abi.encodePacked(to))), "INVALID_ADDRESS");
        transfer(reciever, 100);
        _allowList[to] = true;
    }

    /**  
    ================================================
    |        Verification Functions                |
    ================================================
    **/

    /*
    FUNCTION: isValid
    @Dev: This function consults the merkle library from openzepplin to verify the root, proof, and leaf.
    @Notice: See https://docs.openzeppelin.com/contracts/3.x/api/cryptography#MerkleProof 

    */
  

     function isValid(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }
}