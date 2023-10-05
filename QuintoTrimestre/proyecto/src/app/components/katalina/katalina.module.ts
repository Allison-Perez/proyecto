//Libreriras para el funcionamiento de los componentes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Componentes declarados
import { IndexKatalinaComponent } from './index-katalina/index-katalina.component';
import { PerfilDetalleComponent } from './perfil-detalle/perfil-detalle.component';
import { PerfilComponent } from './perfil/perfil.component';

//Arcivo con el routing
import { KatalinaRoutingModule } from './katalina-routing.module';


@NgModule({
  declarations: [
    IndexKatalinaComponent,
    PerfilDetalleComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    KatalinaRoutingModule,
    ReactiveFormsModule
  ]
})
export class KatalinaModule { }
