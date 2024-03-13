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
  ngAfterViewInit(): void {
    this.email = this.authService.getUserEmail();
    this.inicializarGraficoAsistencias(this.email); 
  }
  inicializarGraficoAsistencias(email: string) {
    this.ServiceService.getAsistenciasPorAprendiz(email).subscribe((data) => {
      const options = {
        series: [
          data.filter((item) => item.status === 'Asistio').length,
          data.filter((item) => item.status === 'Falto').length,
        ],
        labels: ['Asistio', 'Falto'],
        chart: {
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 190,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
  
      var chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();
    });
  }
  
  
 

}
