import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';


@Component({
  selector: 'app-asignar-ficha',
  templateUrl: './asignar-ficha.component.html',
  styleUrl: './asignar-ficha.component.scss'
})
export class AsignarFichaComponent {
  instructores: any[] = [];
  fichas: any[]= [];
  selectedInstructor: number | null = null;
  selectedFicha: number | null = null;
  asignacionExitosa: boolean = false;


  constructor(private serviceService: ServiceService) {
    this.selectedInstructor = null;
    this.selectedFicha = null;
  }

  ngOnInit(): void {
    this.serviceService.getInstructores().subscribe(
      (data) => {
        this.instructores = data;
      },
      (error) => {
        console.error('Error al obtener la lista de instructores', error);
      }
    );

    this.serviceService.getFichas().subscribe(
      (data) => {
        this.fichas = data;
      },
      (error) => {
        console.error('Error al obtener la lista de fichas', error);
      }
    );

  }

  agregarFicha(): void {
    console.log('Entrando a agregarFicha');
    if (this.selectedInstructor && this.selectedFicha) {
      const formData = {
        idUsuario: Number(this.selectedInstructor),
        idFicha: Number(this.selectedFicha)
      };

      this.serviceService.agregarFicha(formData).subscribe(
        (response: any) => {
          console.log('Ficha agregada correctamente');
          console.log('Response:', response);

          if (response.message === 'Ficha asignada correctamente') {
            // Se puede agregar lógica adicional aquí si es necesario
            this.asignacionExitosa = true;
            // setTimeout(() => {
            //   this.asignacionExitosa = false;
            // }, 3000);
        }else{
          console.error('Error inesperado al agregar la ficha al instructor');

        }
      },
        (error) => {

          console.error('Error al agregar la ficha al instructor', error);


          if (error.error && error.error.error === 'Ya existe un registro para este usuario y ficha') {
            // Muestra una alerta al usuario indicando que ya existe el registro
            alert('Ya existe un registro para este usuario y ficha');
          }
        }
      );
    } else {
      console.error('Debes seleccionar un instructor y una ficha');
    }
  }
}
