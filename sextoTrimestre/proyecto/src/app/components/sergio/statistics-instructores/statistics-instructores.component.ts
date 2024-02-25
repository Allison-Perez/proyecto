import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-statistics-instructores',
  templateUrl: './statistics-instructores.component.html',
  styleUrls: ['./statistics-instructores.component.scss']
})
export class StatisticsInstructoresComponent implements OnInit {
  instructores: any[] = [];
  filteredInstructores: any[] = [];
  originalInstructores: any[] = [];
  filtroFicha: number | null = null;
  filtroNombre: string | null = null;
  filtroDocumento: number | null = null;
  listaFichas: number[] = [2558104, 1800002, 11231236, 2634256, 2789008];
  private unsubscribe$ = new Subject<void>();


  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.fetchStaticsInstructores();

  }

  fetchStaticsInstructores(): void {
    this.service.getStaticsInstructores().subscribe(
      (data) => {
        this.instructores = data;
        this.filteredInstructores = data;
        this.originalInstructores = data.slice();
        console.log('Todos los instructores:', this.instructores);
      },
      (error) => {
        console.error('Error al obtener estadísticas de instructores:', error);
      }
    );
  }

  aplicarFiltros() {
    let usuariosFiltrados = this.originalInstructores.slice();

    const filtroFichaNumero = Number(this.filtroFicha) || null;
    console.log('Valor de filtroFichaNumero:', filtroFichaNumero);

    // Filtra la lista según los criterios de filtro
    usuariosFiltrados = usuariosFiltrados.filter((usuario) => {
      console.log('Usuario:', usuario);
      console.log('Número de Ficha del Usuario:', usuario.numeroFicha);

      const cumpleFiltroFicha =
        filtroFichaNumero === null || (+usuario.numeroFicha === filtroFichaNumero);
      const cumpleFiltroNombre =
        !this.filtroNombre || usuario.primerNombre.includes(this.filtroNombre);
      const cumpleFiltroDocumento =
        !this.filtroDocumento || usuario.documento === this.filtroDocumento;

      console.log('Cumple Filtro Ficha:', cumpleFiltroFicha);
      console.log('Cumple Filtro Nombre:', cumpleFiltroNombre);
      console.log('Cumple Filtro Documento:', cumpleFiltroDocumento);

      return cumpleFiltroFicha && cumpleFiltroNombre && cumpleFiltroDocumento;
    });

this.filteredInstructores = usuariosFiltrados;


    console.log('Instructores después de aplicar filtros:', this.filteredInstructores);
  }


  limpiarFiltros() {
    // Restablecer la lista original y los valores de los filtros
    this.filteredInstructores = this.originalInstructores.slice();
    this.filtroFicha = null;
    this.filtroNombre = null;
    this.filtroDocumento = null;
  }
}

