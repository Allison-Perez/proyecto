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
    if (this.selectedInstructor && this.selectedFicha) {
      const formData = {
        idUsuario: Number(this.selectedInstructor),
        idFicha: Number(this.selectedFicha)
      };

      this.serviceService.agregarFicha(formData).subscribe(
        () => {
          console.log('Ficha agregada correctamente');
          // Puedes recargar la lista de instructores o hacer algo más después de agregar la ficha
        },
        (error) => {

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
