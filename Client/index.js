const axios = require("axios").default;
const niceList = require("../utils/nicelist.json");
const MerkleTree = require("../utils/MerkleTree");

const serverUrl = "http://localhost:1225";
async function main() {
  // TODO: how do we prove to the server we're on the nice list?
  const name = document.getElementById("name").value;
  const tree = new MerkleTree(niceList);
  const index = niceList.indexOf(name);

  if (index === -1) {
    document.getElementById("result").innerText =
      "Name not found in the nice list";
    return;
  }

  const proof = tree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    // TODO: add request body parameters here!
    name,
    proof,
  });

  document.getElementById("result").innerText = "Yay! You won a gift!";
  console.log({ gift });
}

document
  .getElementById("giftForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    await main();
  });
