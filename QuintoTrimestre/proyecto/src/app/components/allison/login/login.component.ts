import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  showAlert = false;
  loginForm: FormGroup;

  constructor(private fb:FormBuilder, private http: ServiceService, private router: Router){
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.showAlert = false;

      const formData = this.loginForm.value;

      this.http.login(formData).pipe(
        catchError(error => {
          console.error('Algo salió mal:', error);
          this.showAlert = true;
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Login exitoso', response);
          this.router.navigate(['/index-katalina']);
        }
      });

    } else{
      this.showAlert = true;
    }
  }

}
