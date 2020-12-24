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
 
  constructor(private web3Service: Web3Service, public dialog: MatDialog, public fileHandleService: FileHandleService) { 

    this.fileHandleService.atualizaUploaderComponent(this);

  }

  setHash(hash) {
    this.docHash = hash;
  }

  verificaEstaNotarizado() {
    
    console.log("this.docMetadata=" + this.docMetadada);
    console.log("this.docId=" + this.docId);
    console.log("this.docHash=" + this.docHash);
    
    this.web3Service.verificaEstaNotarizado(this.docMetadada, this.docId, this.docHash);

  }

  notarizar() {

    
  }

  buscarVersoes() {
    
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
