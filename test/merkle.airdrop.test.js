const Token = artifacts.require("Token");
const { expectRevert } = require("@openzeppelin/test-helpers");
const { assert } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

//pregenerated arrays of keys
const pubKeys = [
    "0xce1dfc3F67B028Ed19a97974F8cD2bAF6fba1672",
    "0x4f3471d28B4440638aa6F03578177B434c62923A",
    "0xd7F2Ec225b97a4980BC0E374c37A1DdeE9dF7E41",
    "0x8353a370af52F1C142ae77F79F2A0971Bf51c3f6",
    "0x978de4B9aa737dd7b4722283756845D46020D950",
    "0x715BAA161b1dbe67365d0c24d4c1ad23d30a0c5f",
    "0xb7DDef86Fbb8Ea0b9527De3bB132AFCf7F702Db1",
    "0xB00c85a8616c825EB4aEBf9fD09C57f07256B14f",
    "0x687fCf568088A4C78869B5D727d1E6A2720bc82E",
    "0x6c90e40d009612Fb87Ff36C30f0614FA404cbd18",
    "0x21C0c704A8D80b081e82139E7dD4582F3be1f618",
    "0x550B8095Ae07C5Fd460BC1D97B6Ed425725e2516",
    "0x9a7E7Fe1D917cFe9bF74D39b20e6Af590fA4b102",
    "0x8ff273b0456d79BC5E2C6fbBe2beC1279363a25b",
    "0x3017584D1e931Ea1e84eBc349d774A5A94dEC515",
    "0xb3Bc1D242537270cDF16C7EF4fD3e7dE19A4a2cb",
    "0x6337Df297ebC1f6eC209BE5286591AE2eBb3ec9F",
    "0xED3d5722FFc4A0034c9Ec6ba4DE0a782e621E2C2",
    "0x88aCE9fB8046f0D7E35e188f31f4ed54b3fDAb41",
    "0x528442ed78C92FcAa2D1b130F22590aFF9eAC610",
    "0x2365972567b5ea4026f3dA3988483D5e2973F4a2",
    "0xE66de2691B3d49845CC070278A6026AdBd8b8915",
    "0x2851B721262c413a52df8487A65863714282d558",
    "0xC109ffc93a5E5fb442A7FABA4Eb7fae0D61FE971",
    "0x0F3247964d07CfEeB7d30AB1483E5d71354E5e05",
    "0x42891E21966F0aF5676903efe21087B7648C75C0",
    "0x34444216EB111e54978c0AC9Ac7d89988EEdd977",
    "0x347264C65ef7dd20Da14792E6a9c2d413e11e6a7",
    "0x06b8A2d3a88d174B84682156abF59081A8ea851d",
    "0x4F26d776B725a1cE23011f2151c6877c1cC611d8",
    "0xaB9575D7c6A3d7f7F2915aA6c0521c90c60EdF3f",
    "0x86b3612d160F82223a0987de6b02ef03d026df5A",
    "0x3B3fc02564404DdC01fF3e8be5b92F7c9F2cDF65",
    "0x2D70146b3f3514c2C159522C9BBA7cf1f6E1fD33",
    "0xEe1DA3b3EF078571aF413d7F7Cb6a5308F2DaD53",
    "0xA6A5a17E266b2fB4f2FE8194460F0b86BC4BE88c",
    "0xe1A29Fce7b1372b7C7E0A179B133E49e125D6eC1",
    "0x351959d7Af46b094D84FA1F268048e618B2cA961",
    "0x7a467516A0A355a988be6C187Fbd8FDF1282EFF1",
    "0x615ABFbB9B68b1c4D744AD515a627dcEd2f486Bf",
    "0x35e090775E22aeF3FeA2d84A10446ec669A4Ebbb",
    "0x6330cbACE293881f9672cE5c9E2cD8D00657003d",
    "0xE8a36D7fCc08351F41B4F037829b824B6f1dF21c",
    "0x36640C3928A6452f0505Dd941ce754Ee1271859E",
    "0xA2e1100501939C1CBF93aF1cE7f4Fb5612965864",
    "0xeF6D69df2d3e40724C4eB02B1296A451f90f3CCA",
    "0xF7887798B00895213991698a1238597D049099Ad",
    "0x14C63c0587E2c2362da0Daf208b0b7Bd10fCBACb",
    "0x7598Af09FCa954F7B8C7AaB65904B248D3656C7C",
    "0x2c74a05Fd86ce439ba042576A99226c3a78f37Bc",
    "0xCD51D93Ac1F4328AFcc03f5b692228087752904c",
    "0xDE05772AAa84c68F4cCe4545f15f44405a3b7c2A",
    "0x318Eb11Cab363F3C0E7eCCe51C8043E8618d9bC8",
    "0x1B81864bF4E477795a5D9C113989B4309bda013A",
    "0x9195F86f11659d8218EC7E05897661E0e7d54331",
    "0x2AE928f45527Bb54037F4BEB23dB5302e2412DBb",
    "0xccb609f6b3F8f463e61eEbB5591143BA1B1369d1",
    "0x72B4880d3b5608BB7C752f9542d81DaCBE550E9B",
    "0x45F0D31d32Cb7ABbfab05B29A707E1d63c7F4193",
    "0x47B3f75405b4cACa0B13d4858bbe23c37A49E640",
    "0xB0031FCFfFbf75a76b4957e19FF45225Bc4a0B13",
    "0x31A039D356F36d2C52be86e05D7FeFBb7DAbeF6D",
    "0x41d60C04E71959E5f7f8Af12E9bC32fEf64241c8",
    "0xf219368E4cC70d5D301dCCE294C63CA378F569B8",
    "0xb82f9ca31085cF2f6640d99f4Ca82B8cd48f8784",
    "0xEf359331e2E3579c9eD0597Cd8122eBDDac34972",
    "0xB358B58206D233362358Eb61871C532172d76Ab1",
    "0x78989Ae6Be333D246EF070d1948a6235F6128C1b",
    "0xFB57de127dA701dD40715D1c195601E1C4c18A6e",
    "0xaEb5Bd411dd2cc840a22FcBB2Acd4AfDF2Dd01C4",
    "0x71EFbb4762f315C7bfF951EA3875A6D02F14ED88",
    "0x44CfC3C5f70aD2cfAEc2c8197637d795B536ad96",
    "0x0CCe295f0C2DB861d9769d0557A5281d32918650",
    "0x9Ef7eE80aA5F06032a7aBA59b6C2e88800b2De79",
    "0x96451FBe312A0105A8478ab533301E0C95E8570f",
    "0xad91C865D1eed867a6D311B3e4aA3fb81BFF3973",
    "0x853c14f6d0e00bef1320f686A440224729960c41",
    "0x2947A8885ee82f8EF909b73e0439b53BAd67EA09",
    "0xdB38F0De9f65Dcf6A53c8734dD1f52c2AC9E206d",
    "0x56aF53aDb5083b69E1fe4BFD2FAe5b85F5c1Fb9D",
    "0xa2A1Efa8065d8331ba2c1297B9E15C3019bE7Ab7",
    "0xa180323D177Ecbf42245655c9c821bEB8100c207",
    "0xf364099DCd085a6487c2d7f4d6F7457f6C7168D0",
    "0x9b4b16C1602aE21672c90cA50F4A5720980904d4",
    "0x369CB558D25F14912750cE23ce40231fe645c943",
    "0x8788E7E0542E5B9ec59f07BC7AB9D317EbC98a8d",
    "0xE7d95Dbd2Ff657F05a34a52caD8028Fd7D02B93E",
    "0x772a833A67F739E3C514aa2bb4a9e4c59514213B",
    "0x6DDA82F124B7a595Cd2F5396c7F1993D5b9BaAAF",
    "0xE0707915BE785FFfA6Faa5d0C5f44cf94e3A3eFC",
    "0x1E2E63c061c2B9A2bbeFcCB69ADf65ff4EfaAa11",
    "0xEdbA7aD300985362D3EfA42c16d44A81f8891Bce",
    "0x1Ca0CaC53bb101999B26a185AD68495D15Fc9aCA",
    "0xE6BdDd631DE523370AD3eC95F30a1C9AD23fC7c0",
    "0x1426BD742794142d919b529EF7be37518A6F4408",
    "0x23A0F3cc228cbf6282e698e0409FD8E85c29bd2c",
    "0x129D7Db8f2A355E091b9902bc01C4ABA72dA3028",
    "0x770CbA58923Ea1A5092328c6B580653B31AB1235",
    "0x8E260E77D9c58dF433CeEF907F21a0977371Cf38",
    "0xe62A89e595df37eC6D9434797dFBa2da17716789"
];

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
var keys
var amount = 100;
async function getKeys() {
 

  for (var i = 0; i < amount; i++) {
  let key =  web3.eth.accounts.create();
  let private = key.privateKey;
//   const withoutFirst2 = private.slice(2)
    let public = key.address;
 /// let public = web3.eth.accounts.privateKeyToAccount(private);
// privatekeys.push(withoutFirst2);
  privatekeys.push(private);
  //console.log(withoutFirst2);

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
       let sender = web3.utils.toChecksumAddress(keys[i].privateKey)

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