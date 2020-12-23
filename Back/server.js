// Set up
const express = require('express');
const app = express();                               // create our app w/ express
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const cors = require('cors');
const Promise = require('bluebird');
const config = require('./config.json');
const sql = require("mssql");
const fs 		= require('fs');
const keccak256 = require('keccak256'); 
const https = require ('https');
const multer = require('multer');

app.use(bodyParser.urlencoded({ 'extended': 'true' }));         // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

	next();
});

let contrato_json_Notarizer = require(config.infra.contrato_json_Notarizer);
let contrato_json_IRBBRegistry = require(config.infra.contrato_json_IRBBRegistry);

var n = contrato_json_Notarizer.networks;

console.log("config.infra.rede_blockchain (1=Main|4=Rinkeby|4447=local) = " + config.infra.rede_blockchain);

let addrContratoNotarizer;
let addrContratoRBBRegistry;

//USANDO REDE LACCHAIN
console.log ("config.infra.rede_blockchain=" + config.infra.rede_blockchain);

addrContratoNotarizer = config.infra.endereco_Notarizer;
addrContratoRBBRegistry = config.infra.endereco_RBBRegistry;

console.log("endereco do contrato Notarizer=" + addrContratoNotarizer);
console.log("endereco do contrato RBBRegistry=" + addrContratoRBBRegistry);


app.get('/api/abi', function (req, res) {
	res.json(contratoJson);
})

app.get('/api/hash/:filename', async function (req, res) {
	const filename = req.params.filename;		
	const hashedResult = await calculaHash(config.infra.caminhoUpload + filename);
	return res.json(hashedResult);
})

async function calculaHash(filename) {
	const input = fs.readFileSync(filename);	
	let hashedResult = keccak256(input).toString('hex');	
	return "0x" + hashedResult;					
}

//recupera constantes front
app.post('/api/constantesFront', function (req, res) {
	res.json({ 
		blockchainNetwork: config.infra.rede_blockchain,
		URLBlockchainExplorer: config.infra.URL_blockchain_explorer,
		URLBlockchainProvider: config.infra.URL_blockchain_provider,		
		nomeRedeBlockchain: config.infra.nome_rede_blockchain,
		addrContratoNotarizer: addrContratoNotarizer, 
		addrContratoRBBRegistry: addrContratoRBBRegistry,

		abiNotarizer: contrato_json_Notarizer['abi'],
		abiRBBRegistry: contrato_json_IRBBRegistry['abi'],

	 });
});

console.log("operationAPIURL=" + config.infra.operationAPIURL);

// listen (start app with node server.js) ======================================
app.listen(8080, "0.0.0.0");

let data = "\n" + new Date() + "\nApp listening on port 8080 ";
console.log(data);
