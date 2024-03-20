import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-admin-perfil',
  templateUrl: './admin-perfil.component.html',
  styleUrls: ['./admin-perfil.component.scss']
})

export class AdminPerfilComponent implements OnInit {
  userData: any;
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
      correo: '',
    }
  }

  editarInformacion() {
    this.router.navigate(['/edit-perfil']);
  }

  editarPassword() {
    this.router.navigate(['/update-password']);
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
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
 

}
