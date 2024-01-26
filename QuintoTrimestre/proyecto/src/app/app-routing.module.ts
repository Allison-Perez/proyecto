import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'allison', loadChildren: () => import('./components/allison/allison.module').then(m => m.AllisonModule) },
  { path: 'sergio', loadChildren: () => import('./components/sergio/sergio.module').then(m => m.SergioModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
