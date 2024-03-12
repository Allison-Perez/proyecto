import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-asistencia',
  templateUrl: './ver-asistencia.component.html',
  styleUrls: ['./ver-asistencia.component.scss']
})
export class VerAsistenciaComponent {
  email: string = '';
  pieChartData: any = {
    data: [],
    labels: ['Asistencias', 'Inasistencias']
  };
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;
  
  constructor(private ServiceService: ServiceService, private authService: AuthService, private router: Router ) {}

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
  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    // Obtener datos de asistencia llamando al servicio
    this.ServiceService.getDatosAsistencia(this.email).subscribe(
      (datosAsistencia: any) => {
        this.pieChartData = [datosAsistencia.asistencias, datosAsistencia.inasistencias];
      },
      error => {
        console.error('Error al obtener datos de asistencia:', error);
      }
    );
  }


}
