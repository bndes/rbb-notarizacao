import { Injectable } from '@angular/core';
import { ConstantesService } from './ConstantesService';
import { FileUploader } from 'ng2-file-upload';
import { Web3Service } from './Web3Service';


@Injectable()
export class FileHandleService {

  serverUrl: string;
  maxFileSize : number = 1048576;
  componenteComArquivo: any;

  public uploader: FileUploader;  

  constructor(private web3Service: Web3Service, private constantes: ConstantesService) {

    this.serverUrl = ConstantesService.serverUrl;

    console.log("FileServiceService.ts :: Selecionou URL = " + this.serverUrl);

  }


  atualizaUploaderComponent(c) {
    this.componenteComArquivo = c;
    let self = this;
    this.uploader = new FileUploader({ 
                          url: ConstantesService.serverUrl + "upload",                          
                          maxFileSize: this.maxFileSize,
                          itemAlias:  "arquivo"});

    this.uploader.onAfterAddingFile = (fileItem) => 
    { fileItem.withCredentials = false;      
    };

    this.uploader.onWhenAddingFileFailed = (fileItem) => {
       console.log("fail upload: max file size exceeded! ", fileItem);
       self.componenteComArquivo.hashdeclaracao = "ERRO! Arquivo muito grande! Tente enviar um arquivo menor.";
    }

  }

    processaArquivo($event) {
      console.log("Estou no processa arquivo");
      //console.log(this.uploader)
      //console.log(this.uploader.queue[0].file);
      console.log($event);
      this.readThis($event.target);
    }  

    readThis(inputValue: any) : void {
      var file:File = inputValue.files[0]; 
      let fileContent: string = "";
      var myReader : FileReader = new FileReader();
      let self = this;
  
      myReader.onloadend = function(e){
        // you can perform an action with readed data here
        
        fileContent = myReader.result + "";
        console.log("fileContent", fileContent);
        let hashedResult = self.web3Service.calculaHash(fileContent);
        console.log("hash=", hashedResult);
        self.componenteComArquivo.setHash(hashedResult);
      }
  
      myReader.readAsText(file);
    }


}


