import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      passwordAnterior: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
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
        this.router.navigate(['/admin-perfil']);
      },
      (error: any) => {
          alert('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
      }
  );
}

}
