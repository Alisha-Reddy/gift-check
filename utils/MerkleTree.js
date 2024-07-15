const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");

class MerkleTree {
  constructor(nodes) {
    this.nodes = nodes.map(Buffer.from).map(keccak256);
    /*
            map(): This is a method that creates a new array by applying a function to each element of the original array.
            Buffer.from: This is a function that takes a string (or other types) and converts it into a Buffer, which is a way of handling binary data in Node.js. 
    */
    this.concat = (left, right) => keccak256(Buffer.concat([left, right]));
  }

  getRoot() {
    return bytesToHex(this._getRoot(this.nodes));
  }

  /* A Merkle proof confirms specific transactions represented by a leaf or branch hash within a Merkle hash root. So if anyone ever needs to prove that a transaction existed at one point in time in the blockchain, they just need to provide a Merkle proof */
  getProof(index, layer = this.nodes, proof = []) {
    if (layer.length === 1) {
      return proof;
    }

    const newLayer = [];

    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1];

      if (!right) {
        newLayer.push(left);
      } else {
        newLayer.push(this.concat(left, right));

        if (i === index || i === index - 1) {
          let isLeft = !(index % 2);
          proof.push({
            data: isLeft ? bytesToHex(right) : bytesToHex(left),
            left: !isLeft,
          });
        }
      }
    }

    return this.getProof(Math.floor(index / 2), newLayer, proof);
  }

  // private function

  // Drawing Merkle Tree with the given nodes
  // From bottom to top => hashing 2 children to get the parent
  _getRoot(nodes = this.nodes) {
    if (nodes.length === 1) {
      return nodes[0];
    }

    const layer = [];

    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1];

      if (right) {
        layer.push(this.concat(left, right));
      } else {
        layer.push(left);
      }
    }

    return this._getRoot(layer);
  }
}

module.exports = MerkleTree;
