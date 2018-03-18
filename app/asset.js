"use strict";
const driver = require('bigchaindb-driver');
const prettyjson = require('prettyjson');
module.exports = class Asset{


	//Constructor for the object in case asset is being newly created
	constructor(conn){
		this.conn = conn;
		this.isValid = false;

	}



	//TODO: Validate asset
	//Currently passes all types of asset data
	validateAsset(asset){
		if(false)
		{
			throw new Error("Asset validation failed");
		}

	}


	//Create the asset
	createAsset(privateKey, publicKey, assetdata, metadata ){
		this.publicKey = publicKey;
		this.assetdata = assetdata;
		this.metadata = metadata;
		//THis variable checks if the asset is valid i.e createAsset has been called successfully atleast once
		
		this.validateAsset(assetdata);
		return new Promise((resolve, reject)=>{

			
			const createdTransaction = driver.Transaction.makeCreateTransaction(
				this.assetdata,
				this.metadata,
			    [driver.Transaction.makeOutput(
		        	driver.Transaction.makeEd25519Condition(this.publicKey))
		        ],
	        	this.publicKey
		    )
			// Sign the transaction with private keys of user who is creating this
			this.signedTransaction = driver.Transaction.signTransaction(createdTransaction, privateKey);
			this.assetID = this.signedTransaction.id;
			this.conn.postTransaction(this.signedTransaction).then(()=>{
				return this.conn.pollStatusAndFetchTransaction(this.assetID)
			}).then((res)=>{
				//Incase of success
				resolve(res);

			},(res)=>{
				//Incase of failure
				reject(res)
			})

		});
		//Creating the transaction object

	}



	transferAsset(fromPrivateKey, toPublicKey, metadata){
		//

		return new Promise((resolve, reject)=>{
			this.getAssetStatus().then((status)=>{
				if(status["status"] != "valid")
					throw Error("Asset is not in valid state")

				const txTransfer = driver.Transaction.makeTransferTransaction(
	                        // signedTx to transfer and output index
	                        [{ tx: this.signedTransaction , output_index: 0 }],
	                        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(toPublicKey))],
	                        // metadata
	                        metadata
	                )
	                // Sign with alice's private key
	                this.signedTransaction = driver.Transaction.signTransaction(txTransfer, fromPrivateKey)
	                console.log('Posting signed transaction: ', prettyjson.render(txTransfer))

	                // Post and poll status
	                return this.conn.postTransaction(this.signedTransaction);

			}).then(res => {
	                console.log('Response from BDB server:', prettyjson.render(res))
	                return this.conn.pollStatusAndFetchTransaction(res.id)
	        })
	        .then(tx => {
	                if( tx['outputs'][0]['public_keys'][0] == toPublicKey && tx['inputs'][0]['owners_before'][0] == this.publicKey){
	                	this.publicKey = toPublicKey;
	                	this.assetID = tx.id;
	                	this.metadata = metadata;
	                	resolve(tx)
	                }
	                else{
	                	reject (Error("Mismatch in owners"));
	                }
	        }).catch((e)=>{
	        	reject(e);
	        })
		})




	}



	getAssetStatus(){
		if(this.assetID == undefined){
			throw Error("Asset id is not set for this asset");
		}
		return new Promise((resolve,reject)=>{
			this.conn.getStatus(this.assetID).then(status => {
				if(status) resolve(status);
				else reject();
			});
		});
	}






}