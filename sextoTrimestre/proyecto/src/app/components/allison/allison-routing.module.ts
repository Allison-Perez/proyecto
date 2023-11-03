  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';

  import { LoginComponent } from './login/login.component';
  import { RegistroComponent } from './registro/registro.component';
  import { RecuperarComponent } from './recuperar/recuperar.component';
  import { ValidacionComponent } from './validacion/validacion.component';
  // import { RoleGuard } from './login/role.guard';
import { IndexKatalinaComponent } from '../katalina/index.katalina/index.katalina.component';
import { VistaAdminComponent } from '../sergio/vista-admin/vista-admin.component';

  const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'recuperar', component: RecuperarComponent },
    { path: 'validacion/:correo', component: ValidacionComponent },
    // { path: 'index.katalina', component: IndexKatalinaComponent, canActivate: [RoleGuard], data: { expectedRole: 2 } },
    // { path: 'admin-perfil', component: VistaAdminComponent, canActivate: [RoleGuard], data: { expectedRole: 3 } },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AllisonRoutingModule { }
