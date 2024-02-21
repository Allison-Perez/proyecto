import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators for form validation
import { ServiceService } from '../service/servicie.katalina.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.scss'],
})
export class EditPerfilComponent implements OnInit {
  form: FormGroup;
  userData: any;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      correo: ['']
    });
  }
  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit() {
    // Obtén el correo del usuario, por ejemplo, desde la sesión o almacenamiento local
    let correo:any = localStorage.getItem('user_email');
    correo = correo.replace(/^"(.*)"$/, '$1');

    if (correo) {
      // Llama a tu servicio para obtener la información del usuario por correo
      this.service.getUserInfoByEmail(correo).subscribe(data => {
        this.userData = data;
        this.form.patchValue(data); // Llena el formulario con los datos del usuario
      });
    } else {
      // Maneja el caso en el que el correo no esté disponible, por ejemplo, redirigiendo o mostrando un mensaje de error.
      console.error('El correo no está disponible');
    }
  }

  guardarCambios() {

    if (this.form.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const correo = this.form.value.correo;
    const userData = this.form.value;

    this.service.updateUserInfoByEmail(correo, userData).subscribe(response => {
      // Maneja la respuesta de la actualización
      if (response.status === 200 || 204) {
        alert('Los cambios se guardaron correctamente');

        setTimeout(() => {
          this.router.navigate(['/perfil-detalle']);
        }, 1000);

      } else {
        alert('Hubo un error al guardar los cambios');
      }
    });
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
}
