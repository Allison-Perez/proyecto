import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { SergioRoutingModule } from './sergio-routing.module';
import { VistaAdminComponent } from './vista-admin/vista-admin.component';
import { AdminPerfilComponent } from './admin-perfil/admin-perfil.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';
import { NavComponent } from './nav/nav.component';
import { RegistrosAdminComponent } from './registros-admin/registros-admin.component';
import { ModificarUsuariosComponent } from './modificar-usuarios/modificar-usuarios.component';


@NgModule({
  declarations: [
    IndexComponent,
    VistaAdminComponent,
    AdminPerfilComponent,
    UpdatePasswordComponent,
    EditPerfilComponent,
    NavComponent,
    RegistrosAdminComponent,
    ModificarUsuariosComponent,
  ],
  imports: [
    CommonModule,
    SergioRoutingModule,
    FormsModule, // Importa FormsModule aquí
    ReactiveFormsModule, // Importa ReactiveFormsModule aquí
  ]
})
export class SergioModule { }
