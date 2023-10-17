import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AdminPerfilComponent } from './admin-perfil/admin-perfil.component';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'admin-perfil', component: AdminPerfilComponent },
  { path: 'edit-perfil', component: EditPerfilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SergioRoutingModule { }
