
"use strict";
let Asset =  require('./app/asset.js');

const driver = require('bigchaindb-driver');

const API_PATH = 'http://localhost:9984/api/v1/';

const conn = new driver.Connection(API_PATH);


exports.createAssetObj = ()=>{
	return new Asset(conn);
}


exports.generateKeyPair = ()=>{

	return new driver.Ed25519Keypair()
}



