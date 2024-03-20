import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../services/estadisticas.service';
import * as ApexCharts from 'apexcharts';

interface EstadisticaItem {
  totalBlogs: number;
  totalActividades: number;
  totalHorarios: number;
  totalAsistencias: number;
}

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  estadisticas: EstadisticaItem | null = null;
  fichasPorInstructor: any[] = [];
  charts: { [key: string]: ApexCharts } = {};

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.estadisticasService.obtenerFichasPorInstructor().subscribe(
      (data: any[]) => {
        this.fichasPorInstructor = data;
        this.fetchEstadisticas();
      },
      (error) => {
        console.error('Error al obtener fichas por instructor:', error);
      }
    );
  }

  fetchEstadisticas(): void {
    this.estadisticasService.obtenerEstadisticas().subscribe(
      (data: EstadisticaItem) => {
        this.estadisticas = data;
        this.renderCharts();
      },
      (error) => {
        console.error('Error al obtener estadísticas:', error);
      }
    );
  }

  renderCharts(): void {
    this.renderChart('blogsPorInstructorChart', this.estadisticas?.totalBlogs, '#308189', 'Cantidad de Blogs Subidos', 'Blogs');
    this.renderDoughnutChart('guiasPorInstructorChart', this.estadisticas?.totalActividades, '#f36f42', 'Guías Subidas', 'Guías');
    this.renderLineChart('horariosChart', this.estadisticas?.totalHorarios, '#0876e3', 'Cantidad de Horarios', 'Horarios');
    this.renderBarChart('asistenciasChart', [{ fecha: '', valor: this.estadisticas?.totalAsistencias }], '#f7c46c', 'Cantidad de Asistencias', 'Asistencias');
  }

  renderBarChart(id: string, data: any[], color: string, yAxisTitle: string, tooltipLabel: string): void {
    if (data && data.length > 0) {
      const fechas = data.map(item => item.fecha);
      const valores = data.map(item => item.valor);
  
      this.charts[id] = new ApexCharts(document.querySelector(`#${id}`), {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            endingShape: 'rounded'
          },
        },
        series: [{
          name: yAxisTitle,
          data: valores
        }],
        xaxis: {
          categories: fechas,
          labels: {
            rotate: -45,
            style: {
              fontSize: '12px',
              color: '#000000'
            }
          }
        },
        yaxis: {
          title: {
            text: yAxisTitle,
            style: {
              fontSize: '16px',
              color: color,
            }
          }
        },
        fill: {
          colors: [color]
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ` ${tooltipLabel}`;
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
      });
      this.charts[id].render();
    } else {
      console.error(`Error: No se recibieron datos válidos para la gráfica de ${id}.`);
    }
  }

  renderDoughnutChart(id: string, value: number | undefined, color: string, yAxisTitle: string, tooltipLabel: string): void {
    if (value !== undefined) {
      const chartData = [value];
  
      this.charts[id] = new ApexCharts(document.querySelector(`#${id}`), {
        chart: {
          type: 'donut',
          height: 350,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  offsetY: -10,
                  formatter: function () {
                    return yAxisTitle;
                  }
                },
                value: {
                  show: true,
                  fontSize: '22px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  offsetY: 16,
                  color: color,
                  formatter: function (val: any) {
                    return val;
                  }
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Total',
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#373d3f',
                  formatter: function () {
                    return value.toString();
                  }
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: [color],
        series: chartData,
        labels: [''],
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ` ${tooltipLabel}`;
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
      });
      this.charts[id].render();
    } else {
      console.error(`Error: No se recibieron datos válidos para la gráfica de ${id}.`);
    }
  }

  renderChart(id: string, value: number | undefined, color: string, yAxisTitle: string, tooltipLabel: string): void {
    if (value !== undefined) {
      const chartData = [{
        name: yAxisTitle,
        data: [value]
      }];

      this.charts[id] = new ApexCharts(document.querySelector(`#${id}`), {
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
        colors: [color],
        series: chartData,
        xaxis: {
          categories: [''],
          labels: {
            style: {
              fontSize: '12px',
              color: '#000000'
            }
          }
        },
        yaxis: {
          title: {
            text: yAxisTitle,
            style: {
              fontSize: '16px',
              color: color,
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ` ${tooltipLabel}`;
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
      });
      this.charts[id].render();
    } else {
      console.error(`Error: No se recibieron datos válidos para la gráfica de ${id}.`);
    }
  }

  renderLineChart(id: string, value: number | undefined, color: string, yAxisTitle: string, tooltipLabel: string): void {
    if (value !== undefined) {
      const chartData = [{
        name: yAxisTitle,
        data: [value]
      }];

      this.charts[id] = new ApexCharts(document.querySelector(`#${id}`), {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false
          }
        },
        series: chartData,
        xaxis: {
          categories: ['']
        },
        yaxis: {
          title: {
            text: yAxisTitle,
            style: {
              fontSize: '16px',
              color: color,
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ` ${tooltipLabel}`;
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
      });
      this.charts[id].render();
    } else {
      console.error(`Error: No se recibieron datos válidos para la gráfica de ${id}.`);
    }
  }

  renderAreaChart(id: string, data: any[], color: string, yAxisTitle: string, tooltipLabel: string): void {
    if (data && data.length > 0) {
      const fechas = data.map(item => item.fecha);
      const valores = data.map(item => item.valor);

      this.charts[id] = new ApexCharts(document.querySelector(`#${id}`), {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        series: [{
          name: yAxisTitle,
          data: valores
        }],
        xaxis: {
          categories: fechas
        },
        yaxis: {
          title: {
            text: yAxisTitle,
            style: {
              fontSize: '16px',
              color: color,
            }
          }
        },
        fill: {
          opacity: 0.5,
          colors: [color]
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ` ${tooltipLabel}`;
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
      });
      this.charts[id].render();
    } else {
      console.error(`Error: No se recibieron datos válidos para la gráfica de ${id}.`);
    }
  }
}