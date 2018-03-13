
const bcwrapper = require('./index.js')

const alice = bcwrapper.generateKeyPair();
console.log(alice.publicKey, alice.privateKey)

let testAsset = bcwrapper.createAsset(alice.publicKey, alice.privateKey, {"one":"two"}, {"three":4});

console.log(testAsset.publicKey);

testAsset.getAssetStatus().then(status => console.log(status))