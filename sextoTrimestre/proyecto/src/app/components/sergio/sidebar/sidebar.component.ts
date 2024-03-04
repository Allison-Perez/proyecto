import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  mostrarMenu: boolean = false;
  opcionSeleccionada: string = '';
  opcionesMenu: string[] = ['Listado Instructores','Promedio de Instructores', 'Promedio de Estudiantes', 'Otros'];
  mostrarSidebar: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Constructor correctamente estructurado
  }

  // Función para mostrar/ocultar el menú de perfil
  toggleProfileMenu() {
    console.log(this.mostrarMenuPerfil);

    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  // Función para redirigir a una ruta específica desde el menú de perfil
  redirectTo(route: string) {
    this.router.navigate([route]);
    // Cierra el menú después de redirigir
    this.mostrarMenuPerfil = false;
  }

  // Función para mostrar/ocultar el menú principal
  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  // Función para seleccionar una opción del menú principal
  seleccionarOpcion(opcion: string) {
    this.opcionSeleccionada = opcion;

    // Ejemplo: redirigir a una ruta específica basada en la opción seleccionada
    if (opcion === 'Listado Instructores') {
      this.router.navigate(['/estadisticas-instructores']);
    }else if (opcion === 'Promedio de Instructores') {
      this.router.navigate(['/fichas-instructores']);
    }else if (opcion === 'Promedio de Estudiantes') {
      this.router.navigate(['/fichas-aprendices']);
  }
}

  // Función para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Función para mostrar/ocultar la barra lateral
  toggleSidebar() {
    this.mostrarSidebar = !this.mostrarSidebar;
    console.log("menu");
  }
}
