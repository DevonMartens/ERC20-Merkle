pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract NextContract is ERC20, Ownable  {
    /*@Dev: Allows signiture verification.*/
    using ECDSA for bytes32;

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
    /*@Dev: Mapping to create a nonce to avoid duplication.*/
    mapping(address => uint256) public _userNonce;
    
    /*
    @Dev: Struct for managing the transactions.
    @Notice: Origin is the sender or the approved public key.
    @Notice: Destination is the reciever of the funds.
    @Notice: isBlocked is a bool for disputes.
    @Notice: lockBlock is the block number claim is requested and freedom is when the person can claim.
    */ 
    struct Claimtx {
        address origin;
        address destination;
        bool isBlocked;
        uint lockBlock;
        uint freedomBlock;
    }

    /*@Dev: Mapping between address from tree and claim transaction.*/
    mapping (address => Claimtx) public _txns;

    /*@Dev: Min steak price to despute a transaction*/
    uint256 public minStakePrice = 8e16;//.08 eth

    /**  
    ================================================
    |                EVENTS                        |
    ================================================
    **/

    /*
    @Notice: Few events due to openzepplin having serveral including transfers and minting events
    */

    /*
    @Dev: Event to indicate a txn has been desputed.
    */

    event TransactionDispute(
        address indexed origin,
        address indexed destination,
        uint lockBlock,
        uint freedomBlock
    );

    /**  
    ================================================
    |                CONSTRUCTOR                   |
    ================================================
    **/

    /*
    @Dev: Inputs for ERC20 and root.
    @Notice: ERC20 takes name and symbol/
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
    FUNCTION: initiateTransfer
    @Dev: This function is meant to allow tokens to be claimed by the user but they can move them where ever they want.
    @Params: It takes in the `proof` which generally speaking we would calculate and be passing in on the front end to make things easier for users.
    @Params: It takes in two addresses `to` which is where we are ending the tokens and `merkleApprovedAddress`.
    @Notice: Merkle approved address is the public key allowed to move tokens we check the signiture to confirm that the user has signed the txn indicating where they want the tokens to move.
    @Notice: We check a mapping to confirm the tokens for the address have not be obtained already.
    @Notice: We check the merkle tree for the address as well then start a timer for 48 hours.
    */


     function initiateTransfer(address to, address merkleApprovedAddress, bytes32[] memory proof, bytes memory signature) external {
        require(_txns[merkleApprovedAddress].freedomBlock == 0, "NO_OVERWRITES");
        require(userSignedApprovalForTransfer(to, merkleApprovedAddress, signature), "INVALID_SIGNATURE");
        require(!_allowList[merkleApprovedAddress], 'Already_claimed.');
        require(isValid(proof, keccak256(abi.encodePacked(merkleApprovedAddress))), "INVALID_ADDRESS");
        //starts timer for dispute
        startTimerNow(to, merkleApprovedAddress);
    }

    /* 
    FUNCTION: startTimerNow
    @Dev: This function is internal and only called by `initiateTransfer`.
    @Params: `address to, address merkleApprovedAddress` we use these to build a struct manage the transactions.
    @Notice: The bool isBlocked will be switched to `true` should someone file a dispute during the 48 hour waiting period.
    @Notice: The uint variables represent holding times.
    */

    function startTimerNow(address to, address merkleApprovedAddress) internal {
        //48 hours 
       uint256 lockBlock = block.number; 
       uint256 freedomBlock = block.number + 172800; 
       _allowList[merkleApprovedAddress] = true;
       //sets _txns information
        _txns[merkleApprovedAddress] = Claimtx(
        {
            origin: merkleApprovedAddress,
            destination: to,
            isBlocked: false,
            lockBlock: lockBlock,
            freedomBlock: freedomBlock
        }
        );
        
        emit TransactionDispute(
            merkleApprovedAddress,
            to,
            lockBlock,
            freedomBlock
        );

    }

    /* 
    FUNCTION: claim
    @Dev: This function is internal and only called by `merkleApprovedAddress` to map to the structs.
    @Notice: Checks freedomBlock to ensure enough time has passed the checks isBlock to ensure no active despute.
    @Notice: Gets address from struct.
    */

    function claim(address merkleApprovedAddress) external {   
        require(_txns[merkleApprovedAddress].freedomBlock >= block.number, "48_HOUR_WAITTIME"); 
        require(_txns[merkleApprovedAddress].isBlocked == false, "ACTIVE_DESPUTE");
        address to = _txns[merkleApprovedAddress].destination;
        transfer(to, 100);
        
    }

    /**  
    ================================================
    |            Despute Function                  |
    ================================================
    **/

    /*
    FUNCTION: disputeTransaction
    @Dev: This function is will place a hold on the claim function. Cost .08 eth to despute.
    @Notice: Checks the the freedomBlock not occured but the lockblock has to ensure the wait time.
    @Notice: Sets isBlock to true blocking the claim function.
    @Notice: Requires user to pay a fee. This would normally be staked so they would get it back and maybe a reward should they be stopping a bad actor.
    */

    function disputeTransaction(address merkleApprovedAddress) external payable {
        require(_txns[merkleApprovedAddress].lockBlock < block.number && block.number < _txns[merkleApprovedAddress].freedomBlock, "NOT_PENDING"); 
        require(msg.value == minStakePrice, "FEE_TOO_LOW");  
        _txns[merkleApprovedAddress].isBlocked = true;
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
   
    /*
    FUNCTION: userSignedApprovalForTransfer
    @Dev: This function obtains the users signiture to execute transfer.
    @Params: The `from` variable (address of sender) `to` variable  (address of reciever).
    @Params: The `signiture` Signiture of token holder.
    @Notice: This function requires the signer to be a part of the merkle tree.
    */
    function userSignedApprovalForTransfer(address to, address merkleApprovedAddress, bytes memory signature)
        public
        view
        returns (bool)
    {
        uint256 approveNonce = _userNonce[_msgSender()];
        bytes32 userHash = keccak256(
            abi.encodePacked(address(this), approveNonce, to, _msgSender()));
            address messageSigner = userHash.toEthSignedMessageHash().recover(signature);
            require((messageSigner == merkleApprovedAddress), "INVALID_CALLER");
        return true;
    }
}