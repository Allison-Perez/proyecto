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
  form: FormGroup;
  mensaje: string = '';
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;


  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      passwordAnterior: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required]
    });
  }
  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleProfileMenu() {
    console.log(this.mostrarMenuPerfil);

    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }
 redirectTo(route: string) {
    this.router.navigate([route]);
    // Cierra el menú después de redirigir
    this.mostrarMenuPerfil = false;
  }
  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
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
        this.router.navigate(['/perfil']);
      },
      (error: any) => {
        alert('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
      }
    );
  }
}

