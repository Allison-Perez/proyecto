import { Component } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { AfterViewInit } from '@angular/core';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-fichas-instructores',
  templateUrl: './fichas-instructores.component.html',
  styleUrl: './fichas-instructores.component.scss'
})
export class FichasInstructoresComponent implements AfterViewInit {
  constructor(private ServiceService: ServiceService) {}
  ngAfterViewInit() {
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
}
