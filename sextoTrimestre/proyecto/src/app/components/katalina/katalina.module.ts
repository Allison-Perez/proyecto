import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { IndexKatalinaComponent } from './index.katalina/index.katalina.component';

import { PerfilDetalleComponent } from './perfil-detalle/perfil-detalle.component';
import { KatalinaRoutingModule } from '../katalina/katalina-routing.module';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';
import { VerActividadComponent } from './ver-actividad/ver-actividad.component';
import { VerAsistenciaComponent } from './ver-asistencia/ver-asistencia.component';
import { VerBlogComponent } from './ver-blog/ver-blog.component';
import { VerHorariosComponent } from './ver-horarios/ver-horarios.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';

@NgModule({
  declarations: [
    PerfilDetalleComponent,
    IndexKatalinaComponent,
    EditPerfilComponent,
    VerActividadComponent,
    VerAsistenciaComponent,
    VerBlogComponent,
    VerHorariosComponent,
    EditPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    KatalinaRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [IndexKatalinaComponent],
})
export class KatalinaModule { }
