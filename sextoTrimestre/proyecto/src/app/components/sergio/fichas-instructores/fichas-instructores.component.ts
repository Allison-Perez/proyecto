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
  styleUrl: './fichas-instructores.component.scss',
})
export class FichasInstructoresComponent implements AfterViewInit {
  datosInstructores: any;
  constructor(private ServiceService: ServiceService) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  ngAfterViewInit(): void {
    this.inicializarGraficoDonut();
    this.obtenerYRenderizarBlogsPorInstructorChart();

  }

  obtenerDatos() {
    this.ServiceService.obtenerDatosInstructores().subscribe(
      (data: any) => {
        this.datosInstructores = data.rows;
        this.inicializarGraficoBarra();
      },
      (error) => {
        console.error('Error al obtener datos de instructores:', error);
      }
    );
  }

  inicializarGraficoDonut() {
    this.ServiceService.getFichasInstructores().subscribe((data) => {
      const options = {
        series: data.map((item) => item.totalInstructores),
        labels: data.map((item) => `Ficha ${item.numeroFicha}`),
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


  inicializarGraficoBarra() {
    if (this.datosInstructores) {
      const nombresInstructores = this.datosInstructores.map(
        (instructor: Instructor) =>
          `${instructor.primerNombre} ${instructor.primerApellido}`
      );
      const antiguedadDias = this.datosInstructores.map(
        (instructor: Instructor) => instructor.Antiguedad_Dias
      );

      const colors = ['#6da67a'];

      const data = antiguedadDias.map((value: number, index: number) => ({
        x: nombresInstructores[index],
        y: value,
        fill: colors[index % colors.length],
      }));

      const options = {
        chart: {
          type: 'bar',
          height: 220,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          {
            name: 'Antigüedad (días)',
            data: data,
          },
        ],
        xaxis: {
          categories: nombresInstructores,
        },
      };

      const chart = new ApexCharts(
        document.querySelector('#bar-chart'),
        options
      );

      chart.render().then(() => {
        chart.updateOptions({
          colors: colors,
        });
      });
    }
  }


  obtenerYRenderizarBlogsPorInstructorChart() {
    this.ServiceService.getBlogsPorInstructor().subscribe(data => {
      const options = {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '10%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#308189'],
        series: [{
          name: 'Cantidad de Blogs',
          data: data.map(item => item.cantidadBlogsSubidos)
        }],
        xaxis: {
          categories: data.map(item => item.nombreInstructor),
          labels: {
            style: {
              fontSize: '12px',
              color: '#000000'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Cantidad de Blogs Subidos',
            style: {
              fontSize: '16px',
              color: '#088a88',
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ' Blogs';
            }
          }
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 300,
              }
            }
          }
        ]
      };

      const chart3 = new ApexCharts(document.querySelector("#blogsPorInstructorChart"), options);
      chart3.render();
    });
  }



}
