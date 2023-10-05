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

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    RecuperarComponent,
  ],
  imports: [
    CommonModule,
    AllisonRoutingModule,
    ReactiveFormsModule
  ]
})
export class AllisonModule { }
