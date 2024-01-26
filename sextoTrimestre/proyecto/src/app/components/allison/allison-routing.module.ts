import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { ValidacionComponent } from './validacion/validacion.component';
import { AuthGuard } from './login/role.guard';
import { IndexKatalinaComponent } from '../katalina/index.katalina/index.katalina.component';
import { VistaAdminComponent } from '../sergio/vista-admin/vista-admin.component';
import { VistaInstructorComponent } from '../marlon/vista-instructor/vista-instructor.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'validacion/:correo', component: ValidacionComponent },
  { path: 'index.katalina', component: IndexKatalinaComponent, canActivate: [AuthGuard], data: { expectedRole: 2 } },
  { path: 'vista-admin', component: VistaAdminComponent, canActivate: [AuthGuard], data: { expectedRole: 3 } },
  { path: 'vista-instructor', component: VistaInstructorComponent, canActivate: [AuthGuard], data: { expectedRole: 1 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllisonRoutingModule { }
