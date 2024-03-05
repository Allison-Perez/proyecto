import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { AfterViewInit } from '@angular/core';
import { ServiceService } from '../service/service.service';


@Component({
  selector: 'app-fichas-aprendices',
  templateUrl: './fichas-aprendices.component.html',
  styleUrl: './fichas-aprendices.component.scss'
})

export class FichasAprendicesComponent implements AfterViewInit {
  @ViewChild('chart') chart: ElementRef;
  @ViewChild('edadChart') edadChart: ElementRef;
  constructor(private ServiceService: ServiceService) {
    this.chart = new ElementRef(null); // O asigna un elemento específico si es aplicable
    this.edadChart = new ElementRef(null);
  }

  ngAfterViewInit() {
    this.ServiceService.getFichasAprendices().subscribe(data => {
    const options = {
      series: data.map(item => item.totalAprendices),
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

  this.ServiceService.getDistribucionEdades().subscribe(data => {
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
          horizontal: false,
          columnWidth: '15%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#c1a2a0'],
      series: [{
        name: 'Cantidad',
        data: data.map(item => item.cantidad)
      }],
      xaxis: {
        categories: data.map(item => item.rango_edad),
      },
      yaxis: {
        title: {
          text: 'Cantidad de Aprendices',
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
            return val + ' Aprendices';
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

    const chart2 = new ApexCharts(document.querySelector("#edadChart"), options);
    chart2.render();
  });
}
}
