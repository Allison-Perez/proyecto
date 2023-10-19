import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilFormComponent } from './perfil/perfil.component';
import { PerfilDetalleComponent } from 'src/app/components/katalina/perfil-detalle/perfil-detalle.component';


const routes: Routes = [
    { path: 'perfil', component: PerfilFormComponent },
    { path: 'perfil-detalle', component: PerfilDetalleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class KatalinaRoutingModule {}
