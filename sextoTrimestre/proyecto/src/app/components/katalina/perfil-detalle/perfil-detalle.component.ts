import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { Router } from '@angular/router'; // Agrega esta importación
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute para obtener parámetros de la URL

@Component({
  selector: 'app-perfil-detalle',
  templateUrl: './perfil-detalle.component.html',
  styleUrls: ['./perfil-detalle.component.scss'],
})
export class PerfilDetalleComponent implements OnInit {
  userData: any;
  isMenuOpen: boolean = false;

  constructor(
    private service: ServiceService,
    private router: Router,
    private authService: AuthService // Separar las inyecciones con comas
  ) {
    this.userData = {
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      ficha: '',
      correo: '',
    }
  }

  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit() {
    // Debes obtener el correo del usuario de alguna manera, por ejemplo, desde un servicio de autenticación
    const correo: any = localStorage.getItem('user_email');

    // Llama al servicio para obtener la información del usuario
    this.service.getUserInfoByEmail(JSON.parse(correo)).subscribe(data => {
      this.userData = data;
    });
  }

  editarInformacion() {
    this.router.navigate(['/edit-perfilA']);
  }

  editarPassword() {
    this.router.navigate(['/edit-password']);
  }
  usuario = {
    fotoPerfil: 'assets/fotos_perfil/sena.png'
    // ... otras propiedades del usuario ...
  };

  abrirSelectorDeImagen() {
    const inputFile = document.getElementById('inputFile');
    inputFile?.click();
  }

  onImagenSeleccionada(event: any) {
    const nuevaImagen = event.target.files[0];
    // Lógica para subir la nueva imagen al servidor o almacenamiento en la nube.

    // Después de subir la imagen con éxito, actualiza la URL de la foto en el frontend
    // En este ejemplo, simplemente asignamos una URL estática, pero en la práctica
    // deberías obtener la URL del servidor o almacenamiento en la nube.
    this.usuario.fotoPerfil = 'assets/fotos_perfil/nueva-imagen.jpg';
  }

  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
}

