import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as ApexCharts from 'apexcharts';

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
    this.mostrarMenuPerfil = false;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {
    this.email = this.authService.getUserEmail();
    this.inicializarGraficoAsistencias(this.email);
  }

  inicializarGraficoAsistencias(email: string) {
    console.log('entra');

    this.ServiceService.getAsistenciasPorAprendiz(email).subscribe((data) => {
      console.log(email, data);

      const options = {
        series: [
          data.filter((item) => item.status === 'Asistió').length,
          data.filter((item) => item.status === 'No Asistió').length,
        ],
        labels: ['Asistió', 'No Asistió'],
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
