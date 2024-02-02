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
  opcionesMenu: string[] = ['Promedio de Instructores', 'Promedio de Estudiantes', 'Otros'];

  constructor(private authService: AuthService, private router: Router) {
    // Constructor correctamente estructurado
  }

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  seleccionarOpcion(opcion: string) {
    this.opcionSeleccionada = opcion;

    if (opcion === 'Promedio de Instructores') {
      this.router.navigate(['/estadisticas-instructores']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}




// import { Component } from '@angular/core';
// import { AuthService } from '../service/auth.service';
// import { Router } from '@angular/router';


// @Component({
//   selector: 'app-ver-estadisticas',
//   templateUrl: './ver-estadisticas.component.html',
//   styleUrls: ['./ver-estadisticas.component.scss']
// })
// export class VerEstadisticasComponent {

//   constructor(private authService: AuthService, private router: Router,) {
//     // Constructor correctamente estructurado
//   }
//   logout() {
//     this.authService.logout();
//     // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
//     // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
//     this.router.navigate(['/login']);
//   }

// }

