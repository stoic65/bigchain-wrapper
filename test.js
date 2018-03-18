
const bcwrapper = require('./index.js')
const prettyjson = require('prettyjson');

const alice = bcwrapper.generateKeyPair();
const bob = bcwrapper.generateKeyPair();
const chris = bcwrapper.generateKeyPair();
console.log(alice.publicKey, alice.privateKey)

let testAsset = bcwrapper.createAssetObj();

//Pass in the privatekey, publickey, assetData and metadata while asset creation
testAsset.createAsset( alice.privateKey,alice.publicKey, {"one":"two"}, {"three":4}).then((resp)=>{
	
	//For passing
	testAsset.transferAsset(alice.privateKey, bob.publicKey).then((resolved)=>{
		
		testAsset.transferAsset(bob.privateKey, chris.publicKey, {"new":"fresh"}).then((resolved)=>{
			console.log("Success transfer 2 times",resolved)
		}, (rejected )=>{
			console.log("Fail message",rejected)
		});


	}, (rejected )=>{
		console.log("Fail message",rejected)
	});



}).catch((err) =>{
	console.log(err);
});

