import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilFormComponent } from './perfil/perfil.component';
import { PerfilDetalleComponent } from 'src/app/components/katalina/perfil-detalle/perfil-detalle.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { KatalinaRoutingModule } from './katalina-routing.module';



@NgModule({
  declarations: [PerfilFormComponent, PerfilDetalleComponent],
  imports: [
    CommonModule,
    KatalinaRoutingModule,
    ReactiveFormsModule
  ]
})
export class KatalinaModule { }
