# bigchain-wrapper
A customised wrapper around bigchaindb. This abstracts away all the process of creating and transferring assets. You just need to pass in the public and private keys for any method and not worry about other details
## Adding the package to project
```
npm install <path_of_this_module>
```
## Sample Code
```javascript
const bcwrapper = require("bigchain-wrapper")
const prettyjson = require('prettyjson');

const alice = bcwrapper.generateKeyPair();
const bob = bcwrapper.generateKeyPair();
const chris = bcwrapper.generateKeyPair();
console.log(alice.publicKey, alice.privateKey)

let testAsset = bcwrapper.createAssetObj();

//Pass in the privatekey, publickey, assetData and metadata while asset creation
testAsset.createAsset( alice.privateKey,alice.publicKey, {"one":"two"}, {"three":4}).then((resp)=>{
	
	//For transfers just pass in owners privatekey, public key of person to transfer to and metadata(optional)
	testAsset.transferAsset(alice.privateKey, bob.publicKey).then((resolved)=>{
				//Transferring for the second time

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

```



