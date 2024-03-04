import { Component } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { AfterViewInit } from '@angular/core';
import { ServiceService } from '../service/service.service';


@Component({
  selector: 'app-fichas-aprendices',
  templateUrl: './fichas-aprendices.component.html',
  styleUrl: './fichas-aprendices.component.scss'
})

export class FichasAprendicesComponent implements AfterViewInit {
  constructor(private ServiceService: ServiceService) {}
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
}
}
