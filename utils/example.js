const MerkleTree = require('./MerkleTree');
const niceList = require('./nicelist.json');
const verifyProof = require('./verifyProof');

// Crete the merkle tree for the whole nice list
const merkleTree = new MerkleTree(niceList);

//get the root
const root = merkleTree.getRoot();
console.log(root)

// Find the proof that Rick Haley is in the list
const name = "Rick Haley";
const index = niceList.findIndex(n => n === name);
const proof = merkleTree.getProof(index);
console.log(`Proof for ${name} : ${proof}`);

// verify proof against the Merklr root
console.log(verifyProof(proof, name, root)); //If true, Rick Haley is in the list

