import { Component } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { AfterViewInit } from '@angular/core';
import { ServiceService } from '../service/service.service';

interface Instructor {
  primerNombre: string;
  primerApellido: string;
  Antiguedad_Dias: number;
}

@Component({
  selector: 'app-fichas-instructores',
  templateUrl: './fichas-instructores.component.html',
  styleUrl: './fichas-instructores.component.scss'
})
export class FichasInstructoresComponent implements AfterViewInit {
  datosInstructores: any;
  constructor(private ServiceService: ServiceService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.inicializarGraficoDonut();
  }

  obtenerDatos() {
    this.ServiceService.obtenerDatosInstructores().subscribe(
      (data: any) => {
        this.datosInstructores = data.rows;
        console.log('Datos de instructores:', this.datosInstructores);
        this.inicializarGraficoBarra();
      },
      (error) => {
        console.error('Error al obtener datos de instructores:', error);
      }
    );
  }

  inicializarGraficoDonut() {
    this.ServiceService.getFichasInstructores().subscribe(data => {
    const options = {
      series: data.map(item => item.totalInstructores),
        labels: data.map(item => `Ficha ${item.numeroFicha}`),
      chart: {
      type: 'donut',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  });
}


inicializarGraficoBarra() {
  if (this.datosInstructores) {
    const nombresInstructores = this.datosInstructores.map((instructor: Instructor) => `${instructor.primerNombre} ${instructor.primerApellido}`);
    const antiguedadDias = this.datosInstructores.map((instructor: Instructor) => instructor.Antiguedad_Dias);

    const options = {
      chart: {
        type: 'bar',
        height: 180,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      series: [{
        name: 'Antigüedad (días)',
        data: antiguedadDias,
      }],
      xaxis: {
        categories: nombresInstructores,
      },
    };

    const chart = new ApexCharts(document.querySelector("#bar-chart"), options);
    chart.render();
  } else {
    console.error('Los datos de instructores son undefined.');
  }
}

}
