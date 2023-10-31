import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router'; // Agrega esta importación
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-admin-perfil',
  templateUrl: './admin-perfil.component.html',
  styleUrls: ['./admin-perfil.component.scss']
})

export class AdminPerfilComponent implements OnInit {
  userData: any;

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

  ngOnInit() {
    // Debes obtener el correo del usuario de alguna manera, por ejemplo, desde un servicio de autenticación
    const correo: any = localStorage.getItem('user_email');

    // Llama al servicio para obtener la información del usuario
    this.service.getUserInfoByEmail(JSON.parse(correo)).subscribe(data => {
      this.userData = data;
    });
  }

  editarInformacion() {
    this.router.navigate(['/edit-perfil']);
  }

  editarPassword() {
    this.router.navigate(['/update-password']);
  }

  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }

}