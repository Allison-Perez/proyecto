import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AdminPerfilComponent } from './admin-perfil/admin-perfil.component';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { NavComponent } from './nav/nav.component';
import { VistaAdminComponent } from './vista-admin/vista-admin.component';
import { RegistrosAdminComponent } from './registros-admin/registros-admin.component';



const routes: Routes = [
  { path: '', component: IndexComponent },
  {path: 'vista-admin', component: VistaAdminComponent},
  { path: 'admin-perfil', component: AdminPerfilComponent },
  { path: 'edit-perfil', component: EditPerfilComponent },
  { path: 'update-password', component: UpdatePasswordComponent},
  { path: 'nav', component:NavComponent },
  { path: 'registros-admin', component: RegistrosAdminComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SergioRoutingModule { }
