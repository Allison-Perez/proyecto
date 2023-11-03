import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AllisonModule } from './components/allison/allison.module';
import { SergioModule } from './components/sergio/sergio.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AllisonModule,
    SergioModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
