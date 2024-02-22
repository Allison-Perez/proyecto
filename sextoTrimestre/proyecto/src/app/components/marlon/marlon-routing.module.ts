import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaInstructorComponent } from './vista-instructor/vista-instructor.component';
import { BlogComponent } from './blog/blog.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { ActividadComponent } from './actividad/actividad.component';
// import { HorariosComponent } from './horarios/horarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';

const routes: Routes = [
  { path: 'vista-instructor', component: VistaInstructorComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'actividad', component: ActividadComponent },
  { path: 'asistencia', component: AsistenciaComponent },
  // { path: 'horario', component: HorariosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'cambiar-contrasena', component: CambiarPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarlonRoutingModule {}
