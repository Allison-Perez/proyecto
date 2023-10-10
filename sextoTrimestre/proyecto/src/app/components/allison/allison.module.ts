//Librerias para que funcionen los componentes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//Componentes declarados
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { RecuperarComponent } from './recuperar/recuperar.component';

//Archivo con el routing
import { AllisonRoutingModule } from './allison-routing.module';
import { ValidacionComponent } from './validacion/validacion.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    RecuperarComponent,
    ValidacionComponent,
  ],
  imports: [
    CommonModule,
    AllisonRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AllisonModule { }
