import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service/servicie.katalina.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent {
  cambiarContrasenaForm: FormGroup;
  mensaje: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cambiarContrasenaForm = this.formBuilder.group({
      contrasenaAntigua: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required], // Fixed typo here
    });
  }

  cambiarContrasena() {
    const contrasenaAntigua = this.cambiarContrasenaForm.value.contrasenaAntigua;
    const contrasenaNueva = this.cambiarContrasenaForm.value.contrasenaNueva;
    const confirmarContrasena = this.cambiarContrasenaForm.value.confirmarContrasena;

    if (this.cambiarContrasenaForm.invalid) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (contrasenaNueva !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const email = this.authService.getUserEmail();

    this.service.updatePassword(email, contrasenaAntigua, contrasenaNueva).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.router.navigate(['/admin-perfil']);
      },
      (error: any) => {
        alert('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
      }
    );
  }
}
