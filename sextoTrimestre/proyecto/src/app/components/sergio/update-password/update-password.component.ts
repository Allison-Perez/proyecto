import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Agregado Validators
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router) {
    this.form = this.fb.group({
      passwordAnterior: ['', Validators.required], // Agregado Validators.required
      nuevaPassword: ['', Validators.required], // Agregado Validators.required
      confirmarPassword: ['', Validators.required], // Agregado Validators.required
    });
  }

  ngOnInit() {
    // Puedes agregar lógica de inicialización si es necesaria
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

    // Llama al servicio para cambiar la contraseña y maneja la respuesta
    this.service.updatePassword(passwordAnterior, nuevaPassword).subscribe(
      (response: any) => {
        if (response.status === 200) {
          alert('La contraseña se cambió correctamente');

          setTimeout(() => {
            this.router.navigate(['/perfil']);
          }, 2000);
        } else if (response.status === 401) {
          alert('La contraseña anterior es incorrecta.');
        } else {
          alert('Hubo un error al cambiar la contraseña.');
        }
      },
      (error: any) => {
        console.error('Error al cambiar la contraseña:', error);
        alert('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
      }
    );
  }
}
