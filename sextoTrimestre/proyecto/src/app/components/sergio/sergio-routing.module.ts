import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexPrincipalComponent } from './index-principal/index-principal.component';


const routes: Routes = [
  { path: 'index-Principal', component: IndexPrincipalComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class KatalinaRoutingModule { }
