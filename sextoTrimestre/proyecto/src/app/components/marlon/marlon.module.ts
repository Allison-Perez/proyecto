import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarlonRoutingModule } from './marlon-routing.module';
import { VistaInstructorComponent } from './vista-instructor/vista-instructor.component';
import { BlogComponent } from './blog/blog.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { ActividadComponent } from './actividad/actividad.component';
import { HorariosComponent } from './horarios/horarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule } from '@angular/forms';
import { ActivityService } from './services/actividad.service';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    VistaInstructorComponent,
    BlogComponent,
    AsistenciaComponent,
    ActividadComponent,
    HorariosComponent,
    PerfilComponent,
    EditarPerfilComponent,
    CambiarPasswordComponent,
    EstadisticasComponent,
  ],  
  imports: [
    CommonModule,
    MarlonRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    MatSnackBarModule,
  ],
  providers: [ActivityService],
})
export class MarlonModule {}
