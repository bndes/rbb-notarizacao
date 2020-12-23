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

const mockPJ = config.negocio.mockPJ;


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

app.post('/api/constantesFrontPJ', function (req, res) {
	console.log("operationAPIURL=" + config.infra.operationAPIURL);
	console.log("mockMongoClient=" + config.negocio.mockMongoClient)
	console.log("mockPJ=" + mockPJ)

	let consts = { operationAPIURL: config.infra.operationAPIURL,  
		mockMongoClient: config.negocio.mockMongoClient, 
		mockPJ: mockPJ,
		maxFileSize: MAX_FILE_SIZE
	}

	res.json(consts);

	console.log(consts);

});


app.post('/api/pj-por-cnpj', buscaPJPorCnpj);

	function buscaPJPorCnpj (req, res, next) {
		let cnpjRecebido = req.body.cnpj;

		let isNum = /^\d+$/.test(cnpjRecebido);

		if (!isNum) {			
			res.status(200).json({});
		}


		if (mockPJ) {
			
			console.log("mock PJ ON!");
			https.get('https://www.receitaws.com.br/v1/cnpj/' + cnpjRecebido, (resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				  });

				resp.on('end', () => {
					if (data=="Too many requests, please try again later.") {

						console.log(data)
						let pj = 	
						{
							cnpj: "00000000000000",
							dadosCadastrais: {
								razaoSocial: "Serviço da Receita Indisponível"
							}
						}
						res.status(200).json(pj);
						return;
					} 
					else {
						try {
							jsonData = JSON.parse(data);
						} catch (e) {
							res.status(200).json(pj);
							return;	
						}						
						console.log(jsonData);

						let pj = 	
						{
							cnpj: cnpjRecebido,
							dadosCadastrais: {
								razaoSocial: jsonData.nome
							}
						}
						console.log("pj=");
						console.log(pj);
						res.status(200).json(pj);				
					}

				});
			}).on("error", (err) => {
				console.log("Erro ao buscar mock da API: " + err.message);
			  });

		}
		else {

			new sql.ConnectionPool(configAcessoBDPJ).connect().then(pool => {
				return pool.request()
									 .input('cnpj', sql.VarChar(14), cnpjRecebido)
									 .query(config.negocio.query_cnpj)
				
				}).then(result => {
					let rows = result.recordset
	
					if (!rows[0]) {
						res.status(200).json({});
						return;
					}
	
					let pj = 	
					{
						cnpj: rows[0]["CNPJ_EMPRESA"],
						dadosCadastrais: {
							razaoSocial: rows[0]["NOME_EMPRESARIAL"]
						}
					}
	
					console.log("pj do QSA");				
					console.log(pj);
	
					res.status(200).json(pj);				
					sql.close();
	
	
				}).catch(err => {
					console.log(err);
					res.status(500).send({ message: "${err}"})
					sql.close();
				});

		}

	}	


// listen (start app with node server.js) ======================================
app.listen(8080, "0.0.0.0");

let data = "\n" + new Date() + "\nApp listening on port 8080 ";
console.log(data);
