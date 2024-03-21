import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})

export class RegistroComponent {
  infoUser = {};

  registerForm: FormGroup;
  showError: boolean = false;

  constructor(private http:ServiceService, private fb: FormBuilder, private router: Router){
    this.registerForm = this.fb.group({
      primerNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, this.validateFechaNacimiento]],
      correo: ['', [Validators.required, Validators.email]],
      idPregunta: ['', Validators.required],
      segundoNombre: [''],
      segundoApellido : [''],
      documento: ['', Validators.required],
      ficha: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      respuestaPregunta: ['', Validators.required]
    });
  }

  onSubmit(){
    if (this.registerForm.valid) {
      this.showError = false;

      const formData = this.registerForm.value;

      this.http.registro(formData).pipe(
        catchError(error => {
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.router.navigate(['/login']);
        }
      });

    } else {
      this.showError = true;
    }
  }

  validateFechaNacimiento(control: import('@angular/forms').AbstractControl) {
    const birthDate = new Date(control.value);
    const currentDate = new Date();

    const age = currentDate.getFullYear() - birthDate.getFullYear();
    console.log('Edad:', age);

    if (age < 14) {
      return { menorDe14: true };
    }

    return null;
  }

}
