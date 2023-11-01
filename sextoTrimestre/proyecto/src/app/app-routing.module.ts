import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'katalina',
    loadChildren: () => import('./components/katalina/katalina.module').then(m => m.KatalinaModule),
  },
  {
    path: 'sergio',
    loadChildren: () => import('./components/sergio/sergio.module').then(m => m.SergioModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
