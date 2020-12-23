import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/material.module';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TemplateComponent } from './template/template.component';
import { DialogContentExampleDialog, NotarizeComponent } from './notarize/notarize.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Web3Service } from './Web3Service';
import { ConstantesService } from './ConstantesService';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    SidebarComponent,
    TemplateComponent,
    NotarizeComponent,
    DialogContentExampleDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
    
  ],
  providers: [Web3Service, ConstantesService],
  bootstrap: [AppComponent]
})
export class AppModule { }


