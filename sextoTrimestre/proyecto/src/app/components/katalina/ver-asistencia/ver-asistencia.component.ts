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
    labels: ['Asistencias', 'Inasistencias'] };
    isMenuOpen: boolean = false;
    mostrarMenuPerfil: boolean = false;
    asistencias: any[] = [];
    asistenciasFiltradas: any[] = [];
    fechaFiltro: string = '';
    originalAsistencias: any;


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

  limpiarFiltros() {
    this.fechaFiltro = '';
    this.asistenciasFiltradas = this.asistencias;
  }


  ngOnInit(): void {
    this.email = this.authService.getUserEmail();
    this.getAsistenciasPorCorreo(this.email);
    this.getalertaPorCorreo(this.email);
    
  }

  getAsistenciasPorCorreo(correo: string): void {
    if (!correo) {
      console.error('Error: El correo electrónico no está definido.');
      return;
    }
    this.ServiceService.getasistenciasPorcorreo(correo).subscribe(
      (data) => {
        console.log('Asistencias obtenidas:', data); // Verificar que las asistencias se recuperan correctamente
        this.asistencias = data;
        this.asistenciasFiltradas = this.asistencias; // Asignar las asistencias filtradas inicialmente
      },
      (error) => {
        console.error('Error al obtener las asistencias por correo:', error);
      }
    );
  }

  aplicarFiltroFecha() {
    console.log('entra');

    let asistenciasFiltradas = this.asistencias.slice();

    const filtroFecha = this.fechaFiltro ? new Date(this.fechaFiltro) : null;

    if (!filtroFecha) {
      this.asistenciasFiltradas = asistenciasFiltradas;
      console.log('Asistencias filtradas:', asistenciasFiltradas);
      return;
    }

    asistenciasFiltradas = asistenciasFiltradas.filter(asistencia => {

      const fechaAsistencia = new Date(asistencia.fecha);
      const filtroFechaStr = filtroFecha.toISOString().slice(0, 10); 
      const fechaAsistenciaStr = fechaAsistencia.toISOString().slice(0, 10);

   
      return filtroFechaStr === fechaAsistenciaStr;
    });

   
    this.asistenciasFiltradas = asistenciasFiltradas;
    console.log('Asistencias filtradas:', asistenciasFiltradas);
  }

  getalertaPorCorreo(email: string): void {
    this.ServiceService.getasistenciasPorcorreo(email).subscribe(asistencias => {
      if (this.ServiceService.verificarDecercion(asistencias)) {
        alert('¡Estás iniciando proceso de deserción!');
        // Puedes mostrar un mensaje en un componente de Angular Material en lugar de usar alert
      }
    });
  }
}
 
