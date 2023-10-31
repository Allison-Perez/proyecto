//Libreriras para el funcionamiento de los componentes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Componentes declarados


//Arcivo con el routing
import { KatalinaRoutingModule } from './katalina-routing.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    KatalinaRoutingModule,
    ReactiveFormsModule
  ]
})
export class KatalinaModule { }
