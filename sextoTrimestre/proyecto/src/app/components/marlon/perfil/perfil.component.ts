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
  mostrarMenuPerfil: boolean = false;
  imageFile: File | undefined;
  fotoPerfilUrl: string = '';
  mostrarIconoEliminar: boolean = false;

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
      fotoPerfil: '',
    };
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
    this.mostrarMenuPerfil = false;
  }

  ngOnInit() {
    this.getUserInfo();
  }  

  getUserInfo() {
    const correo: any = localStorage.getItem('user_email');
    this.service.getUserInfoByEmail(JSON.parse(correo)).subscribe(data => {
      this.userData = data;
      this.fotoPerfilUrl = data.fotoPerfil || 'assets/fotos_perfil/sena.png';
    
      this.mostrarIconoEliminar = this.fotoPerfilUrl !== 'assets/fotos_perfil/sena.png';

      this.getProfilePicture();
    });
  }

  getProfilePicture() {
    const correo: any = localStorage.getItem('user_email');
    this.service.getProfilePicture(JSON.parse(correo)).subscribe(response => {
      if (response && response.fotoPerfil) {
        this.fotoPerfilUrl = response.fotoPerfil;
      }
    }, error => {
      console.error('Error al obtener la foto de perfil:', error);
    });
  }

  editarInformacion() {
    this.router.navigate(['/editar-perfil']);
  }

  editarPassword() {
    this.router.navigate(['/edit-password']);
  }

  abrirSelectorDeImagen() {
    const inputFile = document.getElementById('inputFile');
    inputFile?.click();
  }

  onImagenSeleccionada(event: any) {
    this.imageFile = event.target.files[0];
    this.cambiarFotoPerfil(); 
  }

  cambiarFotoPerfil() {
    if (this.imageFile) {
      const emailItem: any = localStorage.getItem('user_email');
      const email: any = emailItem ? emailItem.replace(/['"]+/g, '') : '';
      this.service.updateProfilePicture(email, this.imageFile).subscribe(response => {
        console.log('Respuesta del servidor:', response);
        if (response && response.nuevaUrl) {
          this.fotoPerfilUrl = response.nuevaUrl;
          this.userData.fotoPerfil = response.nuevaUrl;
          console.log('Nueva URL de foto de perfil:', this.userData.fotoPerfil);
        } else {
          console.error('La respuesta del servidor no incluye la nueva URL de la foto de perfil.');
        }
      }, error => {
        console.error('Error al cambiar la foto de perfil:', error);
      });
    } else {
      console.error('No se seleccionó ninguna imagen.');
    }
  }

  eliminarFotoPerfil() {
    const emailItem: any = localStorage.getItem('user_email');
    const email: any = emailItem ? emailItem.replace(/['"]+/g, '') : '';
    this.service.eliminarFotoPerfil(email).subscribe(response => {
      console.log('Foto de perfil eliminada.');
  
      this.fotoPerfilUrl = 'assets/fotos_perfil/sena.png';
      const isDefaultPhoto = this.fotoPerfilUrl === 'assets/fotos_perfil/sena.png';
      this.mostrarIconoEliminar = !isDefaultPhoto;
    }, error => {
      console.error('Error al eliminar la foto de perfil:', error);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
