const Final = artifacts.require("FinalContract");
const { expectRevert } = require("@openzeppelin/test-helpers");
const { assert } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

/*
@Dev: Storage for owner keys and other keys from Ganache
@Notice: Take first and second keys from ganache.
*/

const OWNER_KEYS = "0x705920abdc67b536dea9cebaf1252211197657cc3f19b340dc03babd09363bbe";




/*
@Dev: Imports utils file.
*/

require("./utils");

/*
@Dev: The BN.js library for calculating with big numbers in JavaScript.
*/

const _BN = web3.utils.BN;
const BN = (value) => {
    return new _BN(value)
}


/*
@Dev: converts ether values to Wei to guage function gas usage/
*/

const ONE_TOKEN = web3.utils.toWei("1");
const FOUR_ETH = web3.utils.toWei("3");
const FIVE_ETH = web3.utils.toWei("5");
const STATIC_SUPPLY = web3.utils.toWei("5000000");

/*
@Dev: see `https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#getpastevents`
*/
const getLastEvent = async (eventName, instance) => {
    const events = await instance.getPastEvents(
        eventName,
        {
            fromBlock: 0,
            toBlock: "latest",
        }
    );
    return events.pop().returnValues;
};

var accounts = web3.eth.accounts;

var privatekeys = [];
var pubKeys = [];
var amount = 100;

 

  for (var i = 0; i < amount; i++) {
  let key =  web3.eth.accounts.create();
  let private = key.privateKey;
  const withoutFirst2 = private.slice(2)
  let public = key.address;
  privatekeys.push(private);
  pubKeys.push(public);
}




/*
@notice: contract and corresponding number of accounts. Owner is the first key.
*/
contract("Final", ([
    owner,
    alice,
    bob,
    account4,
    account5,
    account6,
    account7,
    account8,
    account9,
    account10
]) => {

/*
@notice: variables to represent contracts.
*/
   

/*
@dev: Each beforeEach will finish before any test begins.
@notice: variables to represent each input for constructor in packs contract.
*/




describe("Mint Function", () => {   
 //   let token;
    beforeEach(async () => {
            //keys
            const keys = [
                owner,
                alice,
                bob,
                account4,
                account5,
                account6,
                account7,
                account8,
                account9,
                account10
            ];
            const leaves = keys.map(x => keccak256(x));
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
            const buf2hex = x => '0x' + x.toString('hex');

            root = buf2hex(tree.getRoot());

    

            const final = await Final.new(root);

            const nonce = final._userNonce(owner);
         
            //hashes variables
            const message = web3.utils.soliditySha3(
                final.address,
                nonce,
                owner,
                alice,
                owner,
            );
            //signs with private key
            signatureObject = await web3.eth.accounts.sign(
                message,
               OWNER_KEYS
            );
        



});    

    it("it should allow all 100 addresses to mint", async () => {   
        // const leaves = pubKeys.map(x => keccak256(x));
        // const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        // const buf2hex = x => '0x' + x.toString('hex');

        // root = buf2hex(tree.getRoot());

    

        // const final = await Final.new(root);
        //set base number for counting
        let total = 0;
        
        for (var i=0; i < keys.length; i++) {
            const leaf = await keccak256(keys[i]); // address from wallet using walletconnect/metamask
            const proof = tree.getProof(leaf).map(x => buf2hex(x.data));


            await final.initiateTransfer(alice, pubKeys[i], proof, signatureObject.signature);
        
            total +=1;
        }
        
        assert.equal(total, keys.keys);
    });
    it("it change the balance of the account it mints to", async () => {   
    const leaves = pubKeys.map(x => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const buf2hex = x => '0x' + x.toString('hex');

    root = buf2hex(tree.getRoot());

 

    const final = await Final.new(root);
    //set base number for counting
    let total = 0;
    
    for (var i=0; i < pubKeys.length; i++) {
        const leaf = await keccak256(pubKeys[i]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data));


        await final.initiateTransfer(alice, pubKeys[i], proof, signatureObject.signature);
    
        total +=1;
      }
      
      assert.equal(total, pubKeys.length);

      const firstAccountBalance = await final.balanceOf(pubKeys[0]);
      const secondAccountBalance = await final.balanceOf(pubKeys[1]);
      const num = 1;
      const shouldBeBalance = num.toString();

      assert.equal(firstAccountBalance, shouldBeBalance);
      assert.equal(secondAccountBalance, shouldBeBalance);
    });
    it("initiateTransfer should only be allowed to be called by the owner", async () => {   

        
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');
        root = buf2hex(tree.getRoot());
        const leaf = await keccak256(pubKeys[0]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data));

        const final = await Final.new(root);

        await expectRevert(
        final.initiateTransfer(
            alice, pubKeys[i], proof, signatureObject.signature,
            {
                from: alice
            }
        ),
        "Ownable: caller is not the owner"
        );
        
        await final.initiateTransfer(
            alice, pubKeys[i], proof, signatureObject.signature,
            {
                from: owner
            }
        );
    });
});
    it("Addresses not in tree should not be able to get tokens", async () => {   

        
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');
        root = buf2hex(tree.getRoot());
        const leaf = await keccak256(pubKeys[0]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data));

        const final = await Final.new(root);

        await expectRevert(
        final.initiateTransfer(
            alice, pubKeys[i], proof, signatureObject.signature,
        ),
        "INVALID_ADDRESS"
        );
        
        await final.initiateTransfer(
            alice, pubKeys[i], proof, signatureObject.signature,
            {
                from: owner
            }
        );
    });
describe("Inital Values", () => { 
    it("it should have the correct values for root post deployment", async () => {   
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');
    
        root = buf2hex(tree.getRoot());
    
     
    
        const final = await Final.new(root);
        //gets root value
        const liveRoot = await final.root();
          
        assert.equal(root, liveRoot);
    })
});
});


