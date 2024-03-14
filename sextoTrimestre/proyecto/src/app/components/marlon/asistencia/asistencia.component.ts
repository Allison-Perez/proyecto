import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selectedAsistencia: any;
  editandoAsistencia: boolean = false;
  viewMode: boolean = true;
  mostrarTabla: boolean = false;
  sinEstudiantes: boolean = false;
  tempNombre: string | undefined;
  tempCorreo: string | undefined;
  errorMensaje: string | null = null;

  @ViewChild('tablaAsistencias') tablaAsistencias!: ElementRef;

  constructor(private asistenciaService: AsistenciaService, private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
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

  async submitForm() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined && this.idUsuario !== null) {
      await this.crearOActualizarAsistencia();
      this.getAsistencia();
      this.newAsistencia = { fecha: null };
      this.selectedFicha = undefined;
      
    } else {
      console.error('Error: Fecha, ficha o idUsuario no están definidos.');
    }
  }

  async crearOActualizarAsistencia() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined) {
      const userInfo = this.authService.getUserInfo();
      const idUsuario = userInfo.idUsuario;
  
      if (idUsuario !== undefined && idUsuario !== null) {
        const existeAsistencia = await this.asistenciaService.verificarAsistencia(this.newAsistencia.fecha, this.selectedFicha).toPromise();
  
        if (!existeAsistencia) {
          await this.asistenciaService.crearAsistencia(this.newAsistencia.fecha, this.selectedFicha, idUsuario, idUsuario).toPromise();
        }
        this.getAsistencia();
      } else {
        console.error('Error: idUsuario no definido.');
      }
    } else {
      console.error('Error: Fecha o ficha no están definidos.');
    }
  }
  
  getAsistencia() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined && this.idUsuario !== null) {
      this.asistenciaService.getAsistencia(this.newAsistencia.fecha, this.idUsuario, this.selectedFicha)
        .subscribe((data: any[]) => {
          if (data && data.length > 0) {
            this.asistenciaList = data;
            this.sinEstudiantes = false;
            this.errorMensaje = null; 
            if (this.tablaAsistencias) {
              this.tablaAsistencias.nativeElement.style.display = 'block';
            }
          } else {
            this.sinEstudiantes = true;
            this.errorMensaje = 'No se encontraron aprendices asociados a la ficha proporcionada';
            if (this.tablaAsistencias) {
              this.tablaAsistencias.nativeElement.style.display = 'none';
            }
          }
        }, error => {
          console.error('Error al obtener asistencia:', error);
          this.errorMensaje = 'Error al obtener la asistencia. Por favor, inténtalo de nuevo más tarde.';
          console.log('Mensaje de error asignado:', this.errorMensaje);
        });
    } else {
      console.error('Error: Fecha, idUsuario o ficha no están definidos.');
    }
  }
  

  getFichasUsuario() {
    this.asistenciaService.getFichasUsuario().subscribe((data: any[]) => {
      this.fichas = data;
    }, error => {
      console.error('Error al obtener las fichas del usuario:', error);
    });
  }

  marcarAsistencia(asistencia: any, asistio: string) {
    this.asistenciaService.marcarAsistencia(asistencia.identificador, asistio).subscribe(() => {
      this.getAsistencia();
    });
  }
  
  editarAsistencia(asistencia: any) {
    this.tempNombre = asistencia.nombreAprendiz;
    this.tempCorreo = asistencia.correoAprendiz;
    this.selectedAsistencia = asistencia;
    this.editandoAsistencia = true;
    this.asistenciaList.forEach(item => {
      if (item !== asistencia) {
        item.editando = false;
      }
    });
  }
  
  
  actualizarAsistencia(asistencia: any) {
    if (asistencia && asistencia.identificador) {
      const status = asistencia.status;
      const updatedData = { status: status, fallaJustificada: asistencia.fallaJustificada };
      this.asistenciaService.editarAsistencia(asistencia.identificador, updatedData).subscribe(() => {
        const index = this.asistenciaList.findIndex(item => item.identificador === asistencia.identificador);
        if (index !== -1) {
          this.asistenciaList[index].status = status;
          this.asistenciaList[index].nombreAprendiz = this.tempNombre;
          this.asistenciaList[index].correoAprendiz = this.tempCorreo;
        }
        this.editandoAsistencia = false; 
        this.selectedAsistencia = null; 
      }, error => {
        console.error('Error al actualizar la asistencia:', error);
      });
    } else {
      console.error('Error: Asistencia no seleccionada o identificador no definido.');
    }
}

  
  cancelarEdicion(asistencia: any) {
    if (this.tempNombre !== undefined && this.tempCorreo !== undefined) {
      asistencia.nombreAprendiz = this.tempNombre;
      asistencia.correoAprendiz = this.tempCorreo;
    }
    this.selectedAsistencia = null;
    this.editandoAsistencia = false;
  }
  

  onChangeFicha() {
    this.getAsistencia();
  }
}
