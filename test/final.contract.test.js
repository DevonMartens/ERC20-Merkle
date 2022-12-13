const { BN, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expectRevert } = require("@openzeppelin/test-helpers");
const { assert } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

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




// console.log(privatekeys);
// console.log(pubKeys);


/*
@notice: contract and corresponding number of accounts. Owner is the first key.
*/
contract("Token", (privatekeys) => {

/*
@notice: variables to represent contracts.
*/
   

/*
@dev: Each beforeEach will finish before any test begins.
@notice: variables to represent each input for constructor in packs contract.
*/


describe("Address Verification", () => {   
 //   let token;
    beforeEach(async () => {
   
    /*
    @dev: deploys contract and awaits for constructor input.
    @notice: test starts after this
    */

    //1, get root
    //const addresses = publicKeys;



});    

/*
@Dev:Test to check that only the MINTER can call the function to exchange the token.
*/
it("it should allow all 100 addresses to mint", async () => {
    var privatekeys = [];
var pubKeys = [];
var amount = 100;
async function getKeys() {
 

  for (var i = 0; i < amount; i++) {
  let key =  web3.eth.accounts.create();
  let private = key.privateKey;
  const withoutFirst2 = private.slice(2)
   let public = key.address;
 // let public = web3.eth.accounts.privateKeyToAccount(private);
 //privatekeys.push(withoutFirst2);
 privatekeys.push(private);
  console.log(withoutFirst2);

  pubKeys.push(public);

}
}

    await getKeys();
    //get root
    const leaves = pubKeys.map(x => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const buf2hex = x => '0x' + x.toString('hex')  
    const root =  buf2hex(tree.getRoot());
    ///deploy
    const token = await Token.new(root);
    //set base number for counting
    let total = 0;
    
    for (var i=0; i < pubKeys.length; i++) {
        const leaf = keccak256(pubKeys[i]); // address from wallet using walletconnect/metamask
        const proof = tree.getProof(leaf).map(x => buf2hex(x.data))

       // let sender = privatekeys[i].toLowerCase();
       let sender = web3.utils.toChecksumAddress(privatekeys[i])

       console.log(privatekeys);
        await token.mintToken
        (
            proof, 
        {
            from : sender,
        }
        );  
        total +=1;
      }
      
      assert.equal(total, pubKeys.length);
});
});
});