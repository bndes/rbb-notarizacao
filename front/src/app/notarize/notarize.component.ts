import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Web3Service} from '../Web3Service';
import {FileHandleService} from '../file-handle.service';
import { ThrowStmt } from '@angular/compiler';
import { Utils } from '../shared/utils'


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
  cnpjParaBusca: string ; 
  maskCnpj:any;
 

  ngOnInit(): void {
    this.maskCnpj = Utils.getMaskCnpj();
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
    if( this.docId == "" || this.docMetadada==""){
      this.openDialog("verifique se os campos estao preenchidos");
      return;
    }
    if(this.docHash==""){
      this.openDialog("faça o upload do documento");
      return;
    }
    let estaNotarizado = await this.web3Service.verificaEstaNotarizado(this.docMetadada, this.docId, this.docHash);
    
    if(estaNotarizado){
      //this.openDialog();
      console.log("NOTARIZADO");
      this.openDialog("o documento ja foi notarizado");

    }
    else {
      console.log("AINDA NAO NOTARIZADO");
      this.openDialog("o documento ainda não foi notarizado");
    }
   
  }

  async notarizar() {
    if( this.docId == "" || this.docMetadada==""){
      this.openDialog("verifique se os campos estao preenchidos");
      return;
    }
    if(this.docHash==""){
      this.openDialog("faça o upload do documento");
      return;
    }
    //TODO: Leo, antes de efetivamente notarizar é importante observar se jah estah notarizado. 
    let estaNotarizado = await this.web3Service.verificaEstaNotarizado(this.docMetadada, this.docId, this.docHash);

    if (!estaNotarizado) {
      await this.web3Service.notarizar(this.docMetadada,this.docId,this.docHash);
    }
    else {
      //TODO: exibir dialog dizendo que jah estah notarizado
      console.log("NOTARIZADO");
      this.openDialog("ja foi notarizado anteriormente");
    }
    
  }

  async buscarVersoes() {
    
    
    if(this.cnpjParaBusca==undefined || this.docId == "" || this.docMetadada==""){
      this.openDialog("verifique se os campos estao preenchidos");
      return;
    }
    
   let cnpj = Utils.removeSpecialCharacters(this.cnpjParaBusca);
    
    let versoes= await this.web3Service.buscaVersoes(Number(cnpj), this.docMetadada, this.docId);
    
    
    
    
    
    
    

    if(versoes[0]){
      let data=[];
      for (let time of versoes[2] ) {
        //let cover = parseInt(Number(time._hex), 10);
        let cover = Number(time._hex);
        data.push( new Date(cover *1000));
      }
      this.showVersoesOpenDialog(versoes,data);
    }
    else{
      this.openDialog("nenhuma versão encontrada");

    }
/*
TODO:
"versoes" sera um objeto complexo com todos os atributos retornados pelo smart contract
No caso de um retorno false, mensagem deve apenas dizer que não há versão notarizada para os dados passados (CNPJ do Notarizador e metadados do documento).
Se o boolean retornado for true, o vetor de bytes32 é o vetor dos hashs e o de uint é o vetor das datas. Estes dados deverão ser apresentados em ordem inversa cronológica.
*/   


  }

  openDialog(textoErro: any) {
    /*let a = DialogContentExampleDialog;
    
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
    
      const dialogRef = this.dialog.open(DialogContentExampleDialog, {
        
        data: {textoDeErro: textoErro,
          showTextoDeErro: true
          
        
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

  }

  showVersoesOpenDialog(versoes: any , data: any) {
    /*let a = DialogContentExampleDialog;
    
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
    
      const dialogRef = this.dialog.open(DialogContentExampleDialog, {

        
        data: {textoDeErro: "",
                showHash:true,
                hash:versoes[1],
                showDate:true,
                date:data

      }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

  }
 
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  nome:string ;
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  

}
export interface DialogData {
  showTextoDeErro:boolean;
  textoDeErro: any;
  showHash:boolean;
  hash:any;
  showDate:boolean;
  date:any;

  
}