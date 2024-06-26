import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IndexKatalinaComponent } from './index.katalina/index.katalina.component';
import { EditPerfilComponent } from './edit-perfil/edit-perfil.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { PerfilDetalleComponent } from './perfil-detalle/perfil-detalle.component';


import { VerActividadComponent } from './ver-actividad/ver-actividad.component';
import { VerAsistenciaComponent } from './ver-asistencia/ver-asistencia.component';
import { VerBlogComponent } from './ver-blog/ver-blog.component';
import { VerHorariosComponent } from './ver-horarios/ver-horarios.component';


const routes: Routes = [
  { path: 'ver-horarios', component: VerHorariosComponent  },
  { path: 'ver-blog', component: VerBlogComponent  },
  { path: 'ver-asistencias', component: VerAsistenciaComponent  },
  { path: 'ver-actvidades', component: VerActividadComponent  },
  { path: 'edit-perfilA', component: EditPerfilComponent},
  { path: 'edit-password', component: EditPasswordComponent},
  { path: 'perfil-detalle', component: PerfilDetalleComponent },
  { path: 'indexKatalina', component: IndexKatalinaComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule],
  exports: [RouterModule],
})
export class KatalinaRoutingModule { }
