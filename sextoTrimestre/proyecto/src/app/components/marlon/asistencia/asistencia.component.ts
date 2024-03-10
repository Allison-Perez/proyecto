import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  asistenciaList: any[] = [];
  newAsistencia: any = { fecha: null };
  idUsuario: number | null = null;
  fichas: any[] = [];
  selectedFicha: number | undefined;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private asistenciaService: AsistenciaService, private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
    this.mostrarMenuPerfil = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.idUsuario = Number(this.authService.getIdUsuarioActual());
    if (this.idUsuario !== null) {
      this.getFichasUsuario();
    }
  }

  submitForm() {
    this.crearAsistencia();
  }

  crearAsistencia() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined && this.idUsuario !== null) {
      const idInstructor = this.authService.getIdUsuarioActual();
      if (idInstructor !== null) {
        this.asistenciaService.crearAsistencia(this.newAsistencia.fecha, this.selectedFicha, this.idUsuario, idInstructor)
          .subscribe(() => {
            this.getAsistencia();
          }, error => {
            console.error('Error al crear la asistencia:', error);
          });
      } else {
        console.error('Error: ID de instructor no está definido.');
      }
    } else {
      console.error('Error: Fecha, ficha o idAprendiz no están definidos.');
    }
  }
  

  getAsistencia() {
    if (this.newAsistencia.fecha) {
      console.log('Fecha seleccionada:', this.newAsistencia.fecha);
      console.log('ID de Usuario:', this.idUsuario);
      this.asistenciaService.getAsistencia(this.newAsistencia.fecha, this.idUsuario!)
        .subscribe((data: any[]) => {
          console.log('Datos de asistencia recibidos:', data);
          this.asistenciaList = data;
        }, error => {
          console.error('Error al obtener asistencia:', error);
        });
    } else {
      console.error('Error: Fecha no está definida.');
    }
  }

  getFichasUsuario() {
    this.asistenciaService.getFichasUsuario().subscribe((data: any[]) => {
      console.log('Fichas de usuario recibidas:', data);
      this.fichas = data;
      if (this.fichas.length > 0) {
        this.selectedFicha = this.fichas[0].identificador;
        this.crearAsistencia(); // Crear asistencia una vez que se obtengan las fichas
      }
    }, error => {
      console.error('Error al obtener las fichas del usuario:', error);
    });
  }

  marcarAsistencia(asistencia: any, asistio: boolean) {
    asistencia.asistio = asistio;
    this.editarAsistencia(asistencia);
  }

  editarAsistencia(asistencia: any) {
    const updatedData = {};
    this.asistenciaService.editarAsistencia(asistencia.identificador, updatedData).subscribe(() => {
      this.getAsistencia();
    });
  }
}
