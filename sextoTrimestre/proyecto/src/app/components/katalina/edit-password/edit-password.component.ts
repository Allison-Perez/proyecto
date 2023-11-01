import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css'],
})
export class EditPasswordComponent {
  cambiarContrasenaForm: FormGroup;
  mensaje: string = '';


  constructor(private formBuilder: FormBuilder, private ServiceService: ServiceService) {
    this.cambiarContrasenaForm = this.formBuilder.group({
      contrasenaAntigua: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required],
    });
  }

  cambiarContrasena() {
    if (this.cambiarContrasenaForm.valid) {
      const { contrasenaAntigua, contrasenaNueva } = this.cambiarContrasenaForm.value;

      this.ServiceService.cambiarContrasena(contrasenaAntigua, contrasenaNueva).subscribe(
        (response: any) => {
          this.mensaje = response.message;
        },
        (error: any) => {
          this.mensaje = 'Error al cambiar la contraseña. Verifica tus credenciales y vuelve a intentarlo.';
        }
      );
    } else {
      this.mensaje = 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.';
    }
  }
}
