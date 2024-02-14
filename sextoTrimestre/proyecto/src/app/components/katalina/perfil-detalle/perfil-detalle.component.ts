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
      primerNombre: '',
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
    fotoPerfil: 'assets/fotos_perfil/sena.png',  // Inicializa con un valor vacío o con la URL predeterminada si lo deseas
    // ... otras propiedades del usuario ...
  };


  abrirSelectorDeImagen() {
    const inputFile = document.getElementById('inputFile');
    inputFile?.click();
  }
  onImagenSeleccionada(event: any) {
    const nuevaImagen = event.target.files[0];

    // Lógica para subir la nueva imagen al servidor o almacenamiento en la nube.
    // Supongamos que la subida de la imagen es exitosa y obtienes la nueva URL.

    // Simulando la obtención de la nueva URL después de subir la imagen con éxito.
    const nuevaUrl = 'assets/fotos_perfil/nueva-imagen.jpeg';

    // Asigna la nueva URL directamente a la propiedad fotoPerfil del objeto usuario
    this.usuario.fotoPerfil = nuevaUrl;

  }

  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
}

