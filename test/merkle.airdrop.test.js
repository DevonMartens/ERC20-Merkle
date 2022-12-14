const Token = artifacts.require("Token");
const { expectRevert } = require("@openzeppelin/test-helpers");
const { assert } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

/*
@Dev: Storage for owner keys and other keys from Ganache
@Notice: Take first and second keys from ganache.
*/





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
contract("Token", ([
    //privatekeys
    owner,
    alice
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
   
    /*
    @dev: deploys contract and awaits for constructor input.
    @notice: test starts after this
    */

    //1, get root



});    

/*
@Dev:Test to check that only the MINTER can call the function to exchange the token.
*/
    it("it should allow all 100 addresses to mint", async () => {   
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');

        root = buf2hex(tree.getRoot());

    

        const token = await Token.new(root);
        //set base number for counting
        let total = 0;
        
        for (var i=0; i < pubKeys.length; i++) {
            const leaf = await keccak256(pubKeys[i]); // address from wallet using walletconnect/metamask
            const proof = tree.getProof(leaf).map(x => buf2hex(x.data));


            await token.mintToken( pubKeys[i], proof);
        
            total +=1;
        }
        
        assert.equal(total, pubKeys.length);
    });
    it("it change the balance of the account it mints to", async () => {   
    const leaves = pubKeys.map(x => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const buf2hex = x => '0x' + x.toString('hex');

    root = buf2hex(tree.getRoot());

 

    const token = await Token.new(root);
    //set base number for counting
    let total = 0;
    
    for (var i=0; i < pubKeys.length; i++) {
        const leaf = await keccak256(pubKeys[i]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data));


        await token.mintToken(pubKeys[i], proof);
    
        total +=1;
      }
      
      assert.equal(total, pubKeys.length);

      const firstAccountBalance = await token.balanceOf(pubKeys[0]);
      const secondAccountBalance = await token.balanceOf(pubKeys[1]);
      const num = 1;
      const shouldBeBalance = num.toString();

      assert.equal(firstAccountBalance, shouldBeBalance);
      assert.equal(secondAccountBalance, shouldBeBalance);
    });
    it("Mint Token should only be allowed to be called by the owner", async () => {   

        
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');
        root = buf2hex(tree.getRoot());
        const leaf = await keccak256(pubKeys[0]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data));

        const token = await Token.new(root);

        await expectRevert(
        token.mintToken(
            pubKeys[0], 
            proof,
            {
                from: alice
            }
        ),
        "Ownable: caller is not the owner"
        );
        
        await token.mintToken(
            pubKeys[0], 
            proof,
            {
                from: owner
            }
        );
    });
    it("Addresses not in tree should not be able to get tokens", async () => {   

        
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');
        root = buf2hex(tree.getRoot());
        const leaf = await keccak256(pubKeys[0]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data));

        const token = await Token.new(root);

        await expectRevert(
        token.mintToken(
            alice, 
            proof,
        ),
        "INVALID_ADDRESS"
        );
        
        await token.mintToken(
            pubKeys[0], 
            proof,
            {
                from: owner
            }
        );
    });
});
describe("Inital Values", () => { 
    it("it should have the correct values for root post deployment", async () => {   
        const leaves = pubKeys.map(x => keccak256(x));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const buf2hex = x => '0x' + x.toString('hex');
    
        root = buf2hex(tree.getRoot());
    
     
    
        const token = await Token.new(root);
        //gets root value
        const liveRoot = await token.root();
          
        assert.equal(root, liveRoot);
    })
});
});


