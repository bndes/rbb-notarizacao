import { Injectable  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantesService } from './ConstantesService';
import { formattedError } from '@angular/compiler';
import {ethers} from 'ethers';


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

    private FAKE_HASH = ethers.constants.HashZero;


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

    //TODO: incluir docHash
    async verificaEstaNotarizado(docMetadata: string, docId: string, docHash: string) {

        //recupera conta e mudar docHash
        let id = 1;
        docHash = this.FAKE_HASH;

        let result = await this.notarizerSmartContract.isNotarizedDocument(id, docMetadata, docId, docHash);
        return result;

/*
Implementar o código que chama o back para checar se a última versão notarizada pelo mesmo CNPJ (que é o CNPJ de quem está realizando a transação) com os mesmos metadados (nome do campo de identificação do documento e valor do campo de identificação do documento) é igual ou não à versão correspondente ao arquivo que sofreu upload. Isso é feito chamando a função isNotarizedDocument(attesterId, docMetadata, docId, docHash).
Para essa implementação, usar um hash fake (ou colocar temporariamente um campo para entrada do hash explicitamente), pois a implementação do upload e do cálculo do hash poderá ser realizada em outro issue.
Esse mesmo método poderá será reutilizado no início do código do botão Notarizar.
*/
    }
  
    async notarizar(docMetadata: string, docId: string, docHash: string) {
/*
Implementar chamada do back-blockchain para a efetiva notarização.
Implementação mais simples, bastando orquestrar as duas implementadas anteriormente (o upload do arquivo e o cálculo do hash + a chamada da função checar, nessa ordem) com a chamada do método notarizeDocument (docMetadata, docId, docHash) do back.
*/ 
    }

    async buscaVersoes(attesterCNPJ: number, docMetadata: string, docId:string, docHash: string) {
/*
Implementar a a chamada ao método notarizationInfoByData(attesterId, docMetadata, docId) public view returns(bool, bytes32[] memory, uint[] memory). No caso de um retorno false, mensagem deve apenas dizer que não há versão notarizada para os dados passados (CNPJ do Notarizador e metadados do documento).
Se o boolean retornado for true, o vetor de bytes32 é o vetor dos hashs e o de uint é o vetor das datas. Estes dados deverão ser apresentados em ordem inversa cronológica.
*/   
} 

}
