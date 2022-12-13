
This contract is a Merkle-distributor with 100 accounts seeded. It includes unit tests and test data correctly, such that each of these accounts can prove that they are part of the Merkle-tree.

Now add a public function which accepts 2 addresses as parameters, then inside the function, it
verifies that address 1 is part of the tree, then uses address 2 as a contract address, to transfer
erc20 tokens (100 in total), and then stores address 1 to ensure no further claims can be made.

Describe the security issues with the above contract, and in a separate directory, copy the
above contract, and fix your described vulnerabilities. 

When describing, add a unit test to reproduce the vulnerability.


Now that you have a production-ready Merkle Distributor for airdrops, create a third directory,
copy the contracts, and add the following functionality:
- Ensure that claims do not have to be from the msg.sender, such that this contract can be
used with CoWs.
- Add a timeout to claims, such that we can add optimistic disputing.
- Add a public dispute function, such that anyone can put down a stake to ensure a certain
claim is frozen. There is no need to add unfreeze functionality for now.
- Ensure that the dispute function cannot be front-run