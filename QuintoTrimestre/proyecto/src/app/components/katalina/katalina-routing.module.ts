import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexKatalinaComponent } from './index-katalina/index-katalina.component';
import { PerfilDetalleComponent } from './perfil-detalle/perfil-detalle.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  { path: 'index-katalina', component: IndexKatalinaComponent },
  { path: 'perfil-detalle', component: PerfilDetalleComponent },
  { path: 'perfil', component: PerfilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KatalinaRoutingModule { }
