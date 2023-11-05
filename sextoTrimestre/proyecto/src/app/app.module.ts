import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllisonModule } from './components/allison/allison.module';
import { SergioModule } from './components/sergio/sergio.module';
import { KatalinaModule } from './components/katalina/katalina.module';

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
    KatalinaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
