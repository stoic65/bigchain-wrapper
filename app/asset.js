"use strict";
const driver = require('bigchaindb-driver');
module.exports = class Asset{

	constructor(conn,publicKey, privateKey, assetdata, metadata){
		this.conn = conn;
		this.publicKey = publicKey;
		this.privateKey  = privateKey;
		this.assetdata = assetdata;
		this.metadata = metadata;
		console.log("contructed")
		this.validateAsset(assetdata);
		this.createAsset();
	}

	
	printTest()
	{
		console.log("Print test");
	}

	validateAsset(asset){
		if(false)
		{
			throw new Error("Asset validation failed");
		}

	}

	createAsset(){
		const createTransaction = driver.Transaction.makeCreateTransaction(
			this.assetdata,
			this.metadata,
		    [driver.Transaction.makeOutput(
	        	driver.Transaction.makeEd25519Condition(this.publicKey))
	        ],
        	this.publicKey
        )
		// Sign the transaction with private keys of Alice to fulfill it
		this.signedTransaction = driver.Transaction.signTransaction(createTransaction, this.privateKey)
		this.assetID = this.signedTransaction.Id;
		this.conn.postTransaction(this.signedTransaction);
	}

	getAssetStatus(){
		return new Promise((resolve,reject)=>{
			this.conn.pollStatusAndFetchTransaction(this.assetID).then(status => {
				if(status) resolve(status);
				else reject();
			});
		});


	}



}