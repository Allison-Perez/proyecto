import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeticionesService } from '../service/peticiones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilFormComponent {
  perfilForm: FormGroup;

  constructor(
    private router: Router,
    private peticiones: PeticionesService,
    private fb: FormBuilder
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required]],
      foto: ['', [Validators.required]],
      numero_ficha: ['', [Validators.required]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      trimestre: ['', [Validators.required]],
    });
  }

  guardarPerfil() {
    if (this.perfilForm.valid) {
      const perfil = this.perfilForm.value;

      this.peticiones.guardarPerfil(perfil).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/perfil-detalle'], { queryParams: perfil });
        },
        (error) => {
          console.error('Ha ocurrido un error:', error);
        }
      );
    } else {
      this.markFormGroupTouched(this.perfilForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
