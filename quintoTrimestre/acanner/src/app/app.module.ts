import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KatalinaModule } from './components/katalina/katalina.module';


@NgModule({
  declarations: [AppComponent,],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, KatalinaModule], 
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
