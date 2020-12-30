import { Injectable, ɵpublishDefaultGlobalUtils  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from './ConstantesService';
import { formattedError } from '@angular/compiler';
import {ethers, utils} from 'ethers';


@Injectable()
export class Web3Service {

    private serverUrl: string;

    private ethereum: any;
    private provider: any;
    private netVersion: any;
    private accountProvider: any;

    private addrContratoNotarizer: string = '';
    private addrContratoRBBRegistry: string = '';

    private abiNotarizer: string = '';
    private abiRBBRegistry: string = '';

    private notarizerSmartContract: any;
    private rbbRegistrySmartContract: any;
    
    private URLBlockchainExplorer: string;
    private nomeRedeBlockchain: string;
    private numeroBlockchainNetwork: string = '';
    private URLBlockchainProvider: string;

    private vetorTxJaProcessadas : any[];


    constructor(private http: HttpClient, private constantes: ConstantesService) {
       
        this.vetorTxJaProcessadas = [];

        this.serverUrl = ConstantesService.serverUrl;
        let url = this.serverUrl + 'constantesFront';
        console.log("Web3Service.ts :: Selecionou URL = " + url);

        this.http.post<Object>(url, {}).subscribe(
            data => {

                console.log("POST DO SERVER configurando atributos front");


                this.numeroBlockchainNetwork = data["blockchainNetwork"];
                this.URLBlockchainExplorer = data["URLBlockchainExplorer"];
                this.URLBlockchainProvider = data["URLBlockchainProvider"];
                this.nomeRedeBlockchain = data["nomeRedeBlockchain"];
    
                this.addrContratoNotarizer = data["addrContratoNotarizer"];
                this.addrContratoRBBRegistry = data["addrContratoRBBRegistry"];
    
                this.abiNotarizer = data['abiNotarizer'];
                this.abiRBBRegistry = data['abiRBBRegistry'];

                this.intializeWeb3();

            },
            error => {
                console.log("**** Erro ao buscar constantes do front");
            });
            
    }

 
    async intializeWeb3() {

        console.log("this.URLBlockchainProvider = " + this.URLBlockchainProvider);
        this.provider = new ethers.providers.JsonRpcProvider(this.URLBlockchainProvider);
        this.ethereum =  window['ethereum'];

        this.netVersion = await this.ethereum.request({
            method: 'net_version',
        });
        console.log(this.netVersion);

        this.accountProvider = new ethers.providers.Web3Provider(this.ethereum);

        console.log("accountProvider=");
        console.log(this.accountProvider);        

        console.log("INICIALIZOU O WEB3 - addrContratoNotarizer abaixo");
        console.log("this.addrContratoNotarizer=" + this.addrContratoNotarizer);

        this.notarizerSmartContract = new ethers.Contract(this.addrContratoNotarizer, this.abiNotarizer, this.provider);
        this.rbbRegistrySmartContract = new ethers.Contract(this.addrContratoRBBRegistry, this.abiRBBRegistry, this.provider);
 

        console.log("todos os contratos lidos");
        
    }


    public getInfoBlockchain(): any {

        return {

            URLBlockchainExplorer: this.URLBlockchainExplorer,
            nomeRedeBlockchain: this.nomeRedeBlockchain,
            numeroBlockchainNetwork: this.numeroBlockchainNetwork,
            addrContratoNotarizer: this.addrContratoNotarizer,
            addrContratoRBBRegistry: this.addrContratoRBBRegistry,
            URLBlockchainProvider: this.URLBlockchainProvider,

            netVersion: this.netVersion
        };
    }


    public getCurrentAccountSync() {
        return this.accountProvider.getSigner().getAddress();
    }

    conectar () {
        this.ethereum.enable();
    }



    registraWatcherEventosLocal(txHashProcurado, callback) {
        
        let self = this;
        console.info("Callback ", callback);
        console.info("txHashProcurado= ", txHashProcurado);

        this.notarizerSmartContract.on("*", function(evento) {
            self.processaEventoParaChamadaCallback(evento,txHashProcurado,callback);
        });        
    }

    processaEventoParaChamadaCallback(evento, txHashProcurado, callback) {
        if (evento.transactionHash == txHashProcurado) {
            if (!this.vetorTxJaProcessadas.includes(txHashProcurado)) {
                this.vetorTxJaProcessadas.push(txHashProcurado);
                callback();    
            }
        }    
    }

    ////////////////////// INICIO REGISTRY

    async getRBBIDByCNPJSync(cnpj: number) {
        let id = await this.rbbRegistrySmartContract.getIdFromCNPJ(cnpj);
        return id.toNumber();
    }    

    async getCNPJByAddressSync(addr: string) {
        let result = await this.rbbRegistrySmartContract.getRegistry(addr);
        let id = result[1];
        return id.toNumber();
    }    

    async getIdByAddressSync(addr: string) {
        let result = await this.rbbRegistrySmartContract.getRegistry(addr);
        let id = result[0];
        return id; 
    }    

    async getRegistryByAddressSync(addr: string) {
        let result = await this.rbbRegistrySmartContract.getRegistry(addr);
        let registry: {id: number, cnpj: string} 
        registry = {id: (<number>result[0]), cnpj: (<string>result[1])};
        return registry;
    }
    getCnpjByRBBId(id: number) {
        return this.rbbRegistrySmartContract.getCNPJbyID(id);
    }
    

    ////////////////////// FIM REGISTRY

    async verificaEstaNotarizado(docMetadata: string, docId: string, docHash: string) {
        const signer =this.accountProvider.getSigner();
        const contWithSigner = await this.notarizerSmartContract.connect(signer);

        let id = await this.getIdByAddressSync(await this.getCurrentAccountSync());
                
        let result = await contWithSigner.isNotarizedDocument(id, docMetadata, docId, docHash);
        return result;

    }
  
    async notarizar(docMetadata: string, docId: string, docHash: string) {
        const signer = this.accountProvider.getSigner();
        const contWithSigner =await this.notarizerSmartContract.connect(signer);
        
        return await contWithSigner.notarizeDocument(docMetadata,docId,docHash);

    }

    async buscaVersoes(attesterCNPJ: number, docMetadata: string, docId:string) {

        const signer = this.accountProvider.getSigner();
        const contWithSigner =await this.notarizerSmartContract.connect(signer);
        return await contWithSigner.notarizationInfoByData(attesterCNPJ, docMetadata,docId);
        

} 

    calculaHash (textToHash: string) : string {
        //let textToHashAsHex = utils.formatBytes32String(textToHash);
        //let hash = utils.keccak256(textToHashAsHex);
//Compute the keccak256 cryptographic hash of a UTF-8 string, returned as a hex string.
//TODO: avaliar como se comporta quando nao eh UTF-8. Gera algum problema para o hash?
        let hash = utils.id(textToHash);
        return hash;
    }

}
