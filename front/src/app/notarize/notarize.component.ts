import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {Web3Service} from '../Web3Service';
import {FileHandleService} from '../file-handle.service';


@Component({
  selector: 'app-notarize',
  templateUrl: './notarize.component.html',
  styleUrls: ['./notarize.component.scss']
})
export class NotarizeComponent implements OnInit {
  contentHidden: boolean = false;
  docHash: string = "";
  docMetadada: string = "";
  docId: string = "";
  cnpjParaBusca: number = 0; 

  ngOnInit(): void {
  }
 
  constructor(private web3Service: Web3Service, public dialog: MatDialog, public fileHandleService: FileHandleService) { 

    this.fileHandleService.atualizaUploaderComponent(this);

  }

  setHash(hash) {
    this.docHash = hash;
  }

  async verificaEstaNotarizado() {
    
    console.log("this.docMetadata=" + this.docMetadada);
    console.log("this.docId=" + this.docId);
    console.log("this.docHash=" + this.docHash);

    let estaNotarizado = await this.web3Service.verificaEstaNotarizado(this.docMetadada, this.docId, this.docHash);
    
    if(estaNotarizado){
      //this.openDialog();
      console.log("NOTARIZADO");

    }
    else {
      console.log("AINDA NAO NOTARIZADO");
    }
   
  }

  async notarizar() {

    //TODO: Leo, antes de efetivamente notarizar é importante observar se jah estah notarizado. 
    let estaNotarizado = await this.web3Service.verificaEstaNotarizado(this.docMetadada, this.docId, this.docHash);
    if (!estaNotarizado) {
      await this.web3Service.notarizar(this.docMetadada,this.docId,this.docHash);
    }
    else {
      //TODO: exibir dialog dizendo que jah estah notarizado
      console.log("NOTARIZADO");
    }
    
  }

  async buscarVersoes() {

    let versoes = await this.web3Service.buscaVersoes(this.cnpjParaBusca, this.docMetadada, this.docId,this.docHash) 

/*
TODO:
"versoes" sera um objeto complexo com todos os atributos retornados pelo smart contract
No caso de um retorno false, mensagem deve apenas dizer que não há versão notarizada para os dados passados (CNPJ do Notarizador e metadados do documento).
Se o boolean retornado for true, o vetor de bytes32 é o vetor dos hashs e o de uint é o vetor das datas. Estes dados deverão ser apresentados em ordem inversa cronológica.
*/   


  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
