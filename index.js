
"use strict";
let Asset =  require('./app/asset.js');

const driver = require('bigchaindb-driver');

const API_PATH = 'http://localhost:9984/api/v1/';

const conn = new driver.Connection(API_PATH);


exports.createAsset = (publicKey, privateKey, assetdata, metadata)=>{

	if(!(publicKey&&privateKey&&assetdata))
		throw new Error("Invalid parameters");

	console.log("inside createAsset");
	return new Asset(conn,publicKey, privateKey, assetdata, metadata);

}

exports.generateKeyPair = ()=>{

	return new driver.Ed25519Keypair()
}



