import { Component } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ServiceService } from '../service/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registros-admin',
  templateUrl: './registros-admin.component.html',
  styleUrls: ['./registros-admin.component.scss']
})
export class RegistrosAdminComponent {

  infoUser = {};

  registerForm: FormGroup;
  showError: boolean = false;


  registroExitoso: boolean = false;
  registroFallido: boolean = false;
  errorMessage: string = '';

  constructor(private http:ServiceService, private fb: FormBuilder, private router: Router){
    this.registerForm = this.fb.group({
      primer_nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      tipo_documento: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required, this.validateFechaNacimiento]],
      correo: ['', [Validators.required, Validators.email]],
      pregunta_seguridad: ['', Validators.required],
      segundo_nombre: [''],
      segundo_apellido: ['', Validators.required],
      id_usuario: ['', Validators.required],
      ficha: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      respuesta_seguridad: ['', Validators.required]
    });

    this.registroExitoso = false;
    this.registroFallido = false;
  }

  onSubmit(){
    if (this.registerForm.valid) {
      this.showError = false;

      const formData = this.registerForm.value;

      this.http.registro(formData).pipe(
        catchError(error => {
          this.errorMessage = 'Ha ocurrido un error en el registro. Por favor, inténtalo nuevamente.';
          return of(null);
        })
        ).subscribe(response => {
          console.log('Registration Response:', response);
          if (response) {
            this.registroExitoso = true;
            this.registroFallido = false;
            this.errorMessage = '';

          }
        });

    } else {
      if (!this.registroFallido) {
        this.showError = true;
      }
      this.registroExitoso = false;
      this.errorMessage = 'Por favor, completa todos los campos requeridos y asegúrate de que el correo sea válido.';
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
