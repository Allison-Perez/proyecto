import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import * as ApexCharts from 'apexcharts';


@Component({
  selector: 'app-asistencia-fichas',
  templateUrl: './asistencia-fichas.component.html',
  styleUrl: './asistencia-fichas.component.scss'
})


export class AsistenciaFichasComponent implements OnInit {
  asistenciaData: any[] = [];
  fichas: any[] = [];

  constructor(private service: ServiceService) { }

  ngOnInit(): void {
    this.obtenerDatosAsistencia();
  }

  obtenerDatosAsistencia() {
    this.service.obtenerDatosAsistencia().subscribe(
      (data: any[]) => {
        this.asistenciaData = data;
        this.obtenerFichas();
        this.graficarAsistencia(data);
      },
      error => {
        console.error('Error al obtener los datos de asistencia:', error);
      }
    );
  }

  obtenerFichas() {
    this.service.getFichas().subscribe(
      (data: any[]) => {
        this.fichas = data;
      },
      error => {
        console.error('Error al obtener los datos de las fichas:', error);
      }
    );
  }

  obtenerPorcentaje(sesionesAsistidas: number, totalSesiones: number): string {
    const porcentaje = (sesionesAsistidas / totalSesiones) * 100;
    return porcentaje.toFixed(1) + '%';
  }

  graficarAsistencia(data: any[]) {
    const categories = data.map(item => `Ficha ${item.numeroFicha}`);
    const sesionesAsistidas = data.map(item => item.sesiones_asistidas);
    const sesionesNoAsistidas = data.map(item => item.total_sesiones - item.sesiones_asistidas);

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      series: [
        {
          name: 'Sesiones Asistidas',
          data: sesionesAsistidas
        },
        {
          name: 'Sesiones No Asistidas',
          data: sesionesNoAsistidas
        }
      ],
      xaxis: {
        categories: categories
      }
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }
}
