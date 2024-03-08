import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AllisonModule } from './components/allison/allison.module';
import { SergioModule } from './components/sergio/sergio.module';
import { KatalinaModule } from './components/katalina/katalina.module';
import { MarlonModule } from './components/marlon/marlon.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './components/marlon/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AllisonModule,
    SergioModule,
    KatalinaModule,
    FormsModule,
    ReactiveFormsModule,
    MarlonModule,
    NoopAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        }
      }
    })
  ],
  providers: [AuthService,],
  bootstrap: [AppComponent]
})

export class AppModule { }