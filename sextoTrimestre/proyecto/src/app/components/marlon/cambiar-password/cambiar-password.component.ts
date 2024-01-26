import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../services/perfil.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      passwordAnterior: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required]
    });
  }

  cambiarContrasena() {
    const passwordAnterior = this.form.value.passwordAnterior;
    const nuevaPassword = this.form.value.nuevaPassword;
    const confirmarPassword = this.form.value.confirmarPassword;

    if (this.form.invalid) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const email = this.authService.getUserEmail();

    this.service.updatePassword(email, passwordAnterior, nuevaPassword).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.router.navigate(['/perfil']);
      },
      (error: any) => {
        alert('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
      }
    );
  }
}
