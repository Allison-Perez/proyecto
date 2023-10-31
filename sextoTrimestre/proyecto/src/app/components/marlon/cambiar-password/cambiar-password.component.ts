import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CambiarPasswordService } from '../services/cambiar-password.service'; 

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent {
  cambiarContrasenaForm: FormGroup;
  mensaje: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private cambiarPasswordService: CambiarPasswordService
  ) {
    this.cambiarContrasenaForm = this.formBuilder.group({
      contrasenaAntigua: ['', [Validators.required]],
      contrasenaNueva: ['', [Validators.required]],
      confirmarContrasena: ['', [Validators.required]]
    });
  }

  cambiarContrasena() {
    if (this.cambiarContrasenaForm.valid) {
      const { contrasenaAntigua, contrasenaNueva, confirmarContrasena } = this.cambiarContrasenaForm.value;

      if (contrasenaNueva !== confirmarContrasena) {
        this.mensaje = 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.';
      } else {
        this.cambiarPasswordService.cambiarContrasena(contrasenaAntigua, contrasenaNueva).subscribe(
          (response) => {
            this.mensaje = response.message;
          },
          (error) => {
            this.mensaje = 'Error al cambiar la contraseña. Verifica tus credenciales y vuelve a intentarlo.';
          }
        );
      }
    }
  }
}
