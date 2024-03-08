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
      this.getAsistencia();
      this.getFichasUsuario();
    }
  }

  submitForm() {
    this.getAsistencia();
  }

  getAsistencia() {
    if (this.newAsistencia.fecha) {
      this.asistenciaService.getAsistencia(this.newAsistencia.fecha, this.idUsuario!)
        .subscribe((data: any[]) => {
          this.asistenciaList = data;
        });
    } else {
      console.error('Error: Fecha no está definida.');
    }
  }
  
  getFichasUsuario() {
    this.asistenciaService.getFichasUsuario().subscribe((data: any[]) => {
      this.fichas = data;
      if (this.fichas.length > 0) {
        this.selectedFicha = this.fichas[0].identificador;
      }
    });
  }
  
  crearAsistencia() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined) {
      this.asistenciaService.crearAsistencia(this.newAsistencia.fecha, this.selectedFicha)
        .subscribe(() => {
          this.getAsistencia();
        });
    } else {
      console.error('Error: Fecha o ficha no están definidos.');
    }
  }
  

  marcarAsistencia(asistencia: any, asistio: boolean) {
    asistencia.asistio = asistio;
    this.editarAsistencia(asistencia);
  }

  editarAsistencia(asistencia: any) {

    const updatedData = { };
    this.asistenciaService.editarAsistencia(asistencia.identificador, updatedData).subscribe(() => {
      this.getAsistencia();
    });
  }
}
