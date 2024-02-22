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
  selectednumeroFicha: string = '';

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

  // applyFilters(): void {
  //   console.log('Ficha seleccionada:', this.selectednumeroFicha);

  //   this.filteredInstructores = this.instructores.filter((instructor) => {
  //     const selectedFichaString = this.selectednumeroFicha.toString();
  //     return (
  //       !selectedFichaString || instructor.numeroFicha.toString() === selectedFichaString
  //     );
  //   });


  //   console.log('Instructores filtrados:', this.filteredInstructores);
  // }

}
