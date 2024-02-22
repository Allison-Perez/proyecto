import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/perfil.service';
import { Router } from '@angular/router';
import { AuthService } from '../../allison/service/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  userData: any;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false

  constructor(
    private service: ServiceService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userData = {
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      numeroFicha: '',
      correo: '',
      fechaIngreso: '',
      celular: '',
      informacionAcademica: '',
      informacionAdicional: '',
    };
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

  ngOnInit() {
    // Debes obtener el correo del usuario de alguna manera, por ejemplo, desde un servicio de autenticación
    const correo: any = localStorage.getItem('user_email');

    // Llama al servicio para obtener la información del usuario
    this.service.getUserInfoByEmail(JSON.parse(correo)).subscribe(data => {
      this.userData = data;
    });
  }

  editarInformacion() {
    this.router.navigate(['/editar-perfil']);
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
