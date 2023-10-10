import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { ValidacionComponent } from './validacion/validacion.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'validacion/:correo', component: ValidacionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllisonRoutingModule { }
