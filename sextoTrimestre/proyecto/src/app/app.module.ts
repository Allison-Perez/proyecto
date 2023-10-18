import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarlonModule } from './components/marlon/marlon.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivityService } from './components/marlon/services/actividad.service'; 


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MarlonModule,
    AppRoutingModule
  ],
  providers: [ActivityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
