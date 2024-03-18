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
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    console.log(this.mostrarMenuPerfil);
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
      const email: any = localStorage.getItem('user_email');
      this.service.updateProfilePicture(email, this.imageFile).subscribe(response => {
        console.log('Respuesta del servidor:', response);
        this.fotoPerfilUrl = response.nuevaUrl;
        this.userData.fotoPerfil = response.nuevaUrl;
        console.log('Nueva URL de foto de perfil:', this.userData.fotoPerfil);
  
        localStorage.setItem('user_fotoPerfil', response.nuevaUrl);
      }, error => {
        console.error('Error al cambiar la foto de perfil:', error);
      });
    } else {
      console.error('No se seleccionó ninguna imagen.');
    }
  }
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
