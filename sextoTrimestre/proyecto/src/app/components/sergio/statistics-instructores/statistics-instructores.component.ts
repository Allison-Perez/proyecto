// // statistics-instructores.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ServiceService } from '../service/service.service';

// @Component({
//   selector: 'app-statistics-instructores',
//   templateUrl: './statistics-instructores.component.html',
//   styleUrls: ['./statistics-instructores.component.scss']
// })
// export class StatisticsInstructoresComponent implements OnInit {
//   instructores: any[] = [];

//   constructor(private serviceService: ServiceService) {}

//   ngOnInit() {
//     this.serviceService.getStaticsInstructores()
//       .subscribe(
//         data => this.instructores = data,
//         error => console.error('Error al obtener los instructores:', error)
//       );
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { ServiceService } from '../service/service.service';
// import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

// @Component({
//   selector: 'app-statistics-instructores',
//   templateUrl: './statistics-instructores.component.html',
//   styleUrls: ['./statistics-instructores.component.scss']
// })
// export class StatisticsInstructoresComponent implements OnInit {
//   instructores: any[] = [];

//   public barChartOptions: ChartOptions = {
//     responsive: true,
//   };
//   public barChartLabels: string[] = ['Instructor 1', 'Instructor 2', 'Instructor 3', 'Instructor 4', 'Instructor 5'];
//   public barChartType: ChartType = 'bar';
//   public barChartLegend = true;
//   public barChartData: ChartDataset[] = [
//     { data: [10, 15, 7, 12, 20], label: 'Número de Alumnos' },
//   ];

//   constructor(private serviceService: ServiceService) {}

//   ngOnInit() {
//     this.serviceService.getStaticsInstructores()
//       .subscribe(
//         data => {
//           this.instructores = data;
//           this.updateChartData();
//         },
//         error => console.error('Error al obtener los instructores:', error)
//       );
//   }

//   updateChartData() {
//     // Lógica para actualizar los datos del gráfico
//     this.barChartLabels = this.instructores.map(instructor => `${instructor.primer_nombre} ${instructor.primer_apellido}`);
//     this.barChartData = [
//       { data: this.instructores.map(instructor => instructor.alguna_propiedad), label: 'Alguna Etiqueta' },
//       // Agrega más series según sea necesario
//     ];
//   }
// }


// statistics-instructores.component.ts

import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-statistics-instructores',
  templateUrl: './statistics-instructores.component.html',
  styleUrls: ['./statistics-instructores.component.scss']  // Puedes ajustar esto según tus estilos
})
export class StatisticsInstructoresComponent implements OnInit {
  instructores: any[] = [];
  filteredInstructores: any[] = [];
  selectedFicha: string = '';

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.fetchStaticsInstructores();
  }

  fetchStaticsInstructores(): void {
    this.service.getStaticsInstructores().subscribe(
      (data) => {
        this.instructores = data;
        this.filteredInstructores = data;
        console.log('Todos los instructores:', this.instructores);
      },
      (error) => {
        console.error('Error al obtener estadísticas de instructores:', error);
      }
    );
  }

  applyFilters(): void {
    console.log('Ficha seleccionada:', this.selectedFicha);

    this.filteredInstructores = this.instructores.filter((instructor) => {
      return (
        (!this.selectedFicha || instructor.ficha.toString() === this.selectedFicha.toString())
      );
    });


    console.log('Instructores filtrados:', this.filteredInstructores);
  }
}
