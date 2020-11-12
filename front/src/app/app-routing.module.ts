import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { NotarizeComponent } from './notarize/notarize.component';

const routes: Routes = [
  { path: '', component: TemplateComponent,
    children: [
      {
        path: 'notarize', component: NotarizeComponent,
      },
      {
        path: '', component: NotarizeComponent,
      }      
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
