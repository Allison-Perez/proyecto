import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { SergioRoutingModule } from './sergio-routing.module';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    SergioRoutingModule
  ]
})
export class SergioModule { }
