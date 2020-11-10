import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { NotarizeComponent } from './notarize/notarize.component';

const routes: Routes = [
  { path: 'home', component: TemplateComponent,
    children: [
      {
        path: 'notarize', component: NotarizeComponent,
      }
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
