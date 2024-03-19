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
  }


  // getAsistenciasPorCorreo(correo: string): void {
  //   if (!correo) {
  //     console.error('Error: El correo electrónico no está definido.');
  //     return;
  //   }

  //   this.ServiceService.getasistenciasPorcorreo(correo).subscribe(
  //     (data) => {
  //       this.asistencias = data;
  //       this.originalAsistencias = data;
  //     },
  //     (error) => {
  //       console.error('Error al obtener las asistencias por correo:', error);
  //     }
  //   );
  // }

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


  // aplicarFiltroFecha() {
  //   console.log('entra');

  //   let asistenciasFiltradas = this.originalAsistencias.slice();

  //   // Convertir la fecha de filtro a formato de fecha si es una cadena
  //   const filtroFecha = this.fechaFiltro ? new Date(this.fechaFiltro) : null;

  //   // Filtrar la lista según los criterios de filtro de fecha
  //   asistenciasFiltradas = asistenciasFiltradas.filter((asistencia: { fecha: string | number | Date; }) => {
  //     // Convertir la fecha de la asistencia a formato de fecha
  //     const fechaAsistencia = new Date(asistencia.fecha);

  //     // Comprobar si la fecha de la asistencia coincide con la fecha de filtro
  //     const cumpleFiltroFecha = !filtroFecha || fechaAsistencia.getTime() === filtroFecha.getTime();

  //     return cumpleFiltroFecha;
  //   });

  //   this.asistenciasFiltradas = asistenciasFiltradas;
  // }

  aplicarFiltroFecha() {
    console.log('entra');

    // Realizamos una copia de las asistencias originales para no modificar el array original
    let asistenciasFiltradas = this.asistencias.slice();

    // Convertir la fecha de filtro a un objeto Date si se proporciona una fecha válida
    const filtroFecha = this.fechaFiltro ? new Date(this.fechaFiltro) : null;

    // Si no se proporciona una fecha válida, mostramos todas las asistencias
    if (!filtroFecha) {
      this.asistenciasFiltradas = asistenciasFiltradas;
      console.log('Asistencias filtradas:', asistenciasFiltradas);
      return;
    }

    // Filtramos las asistencias basadas en la fecha
    asistenciasFiltradas = asistenciasFiltradas.filter(asistencia => {
      // Convertimos la fecha de la asistencia a un objeto Date
      const fechaAsistencia = new Date(asistencia.fecha);

      // Convertir ambas fechas a cadenas de texto en formato ISO
      const filtroFechaStr = filtroFecha.toISOString().slice(0, 10); // Solo tomamos la parte de la fecha
      const fechaAsistenciaStr = fechaAsistencia.toISOString().slice(0, 10);

      // Comparamos las fechas como cadenas de texto
      return filtroFechaStr === fechaAsistenciaStr;
    });

    // Actualizamos las asistencias filtradas
    this.asistenciasFiltradas = asistenciasFiltradas;
    console.log('Asistencias filtradas:', asistenciasFiltradas);
  }




}
