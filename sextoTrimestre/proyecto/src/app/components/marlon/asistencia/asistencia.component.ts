import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';

interface Asistencia {
  nombreAprendiz: string;
  fallas: number;
}

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
  aprendizId: string = '';
  mostrarAlertaActiva: boolean = false;
  mensajeAlerta: string = '';
  mostrarAvisoTresFallas: boolean = false;
  mostrarAvisoCincoFallas: boolean = false;
  noAsistioConsecutivas: number = 0;

  @ViewChild('tablaAsistencias') tablaAsistencias!: ElementRef;

  constructor(private asistenciaService: AsistenciaService, private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}


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

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  

  async submitForm() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined && this.idUsuario !== null) {
      await this.crearOActualizarAsistencia();
      this.getAsistencia();
      this.newAsistencia = { fecha: null };
      this.selectedFicha = undefined;
      this.verificarFallasConsecutivasYEnviarAlerta();
    } else {
      console.error('Error: Fecha, ficha o idUsuario no están definidos.');
    }
  }

  async crearOActualizarAsistencia() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined) {
        const userInfo = this.authService.getUserInfo();
        const idUsuario = userInfo.idUsuario;

        if (idUsuario !== undefined && idUsuario !== null) {
            const existeAsistencia = await this.asistenciaService.verificarAsistencia(this.newAsistencia.fecha, this.selectedFicha, idUsuario).toPromise();

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
        console.log('Respuesta de asistencia:', data); 
        if (data && data.length > 0) {
          this.asistenciaList = data;
          this.sinEstudiantes = false;
          this.errorMensaje = null; 
          if (this.tablaAsistencias) {
            this.tablaAsistencias.nativeElement.style.display = 'block';
          }
          this.verificarFallasConsecutivasYEnviarAlerta(); 
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
      if (asistio === 'No Asistió') {
        this.noAsistioConsecutivas++;
      } else {
        this.noAsistioConsecutivas = 0; 
      }
      this.verificarAprendicesConFallas(); 
    }, error => {
      console.error('Error al marcar asistencia:', error);
      this.mostrarError('Error al marcar asistencia. Por favor, inténtalo de nuevo.');
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
          this.asistenciaList[index].primerApellidoAprendiz = asistencia.primerApellidoAprendiz;
          this.asistenciaList[index].segundoApellidoAprendiz = asistencia.segundoApellidoAprendiz;
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
  
  async verificarFallasConsecutivasYEnviarAlerta() {
    const mensajesAlerta: string[] = [];
    const fallasObservables: Observable<any>[] = [];
  
    for (const asistencia of this.asistenciaList) {
      const aprendizId = asistencia.idAprendiz;
      try {
        const fallasObservable = this.asistenciaService.obtenerFallasConsecutivasMultiple([aprendizId]);
        fallasObservables.push(fallasObservable);
      } catch (error) {
        console.error('Error al obtener las fallas:', error);
      }
    }
  
    forkJoin(fallasObservables).subscribe((result: any[]) => {
      result.forEach((fallas: any, index: number) => {
        console.log('Fallas consecutivas:', fallas);
        const aprendiz = this.asistenciaList[index];
        if (fallas !== undefined) {
          if (fallas >= 3 && fallas < 5 && !this.mostrarAvisoTresFallas) {
            const mensaje = `El/La aprendiz ${aprendiz.nombreAprendiz} tiene ${fallas} fallas consecutivas y está en inicio de deserción.`;
            mensajesAlerta.push(mensaje);
            this.mostrarAvisoTresFallas = true;
          } else if (fallas >= 5 && !this.mostrarAvisoCincoFallas) {
            const mensaje = `El/La aprendiz ${aprendiz.nombreAprendiz} tiene ${fallas} fallas consecutivas y está en proceso avanzado de deserción.`;
            mensajesAlerta.push(mensaje);
            this.mostrarAvisoCincoFallas = true;
          }
        } else {
          console.error('Error: Fallas no definidas para el aprendiz', aprendiz.nombreAprendiz);
        }
      });
  
      // Mostrar todas las alertas juntas
      this.mostrarAlertaMultiple(mensajesAlerta);
    });
  }
  

  verificarAprendicesConFallas() {
    const aprendicesConFallas = this.asistenciaList.filter(asistencia => {
      return asistencia.status === 'No Asistió' && (asistencia.fallasConsecutivas >= 3 || asistencia.fallasConsecutivas >= 5);
    });
  
    if (aprendicesConFallas.length > 0) {
      aprendicesConFallas.forEach(aprendiz => {
        const aprendizId = aprendiz.idAprendiz;
        this.asistenciaService.obtenerFallasConsecutivasMultiple([aprendizId]).subscribe(fallas => {
          const mensaje = `El aprendiz ${aprendiz.nombreAprendiz} tiene ${fallas} fallas consecutivas.`;
          this.mostrarAlerta(mensaje);
        });
      });
    }
  }
  
  
  mostrarAlertaMultiple(mensajes: string[]) {
    mensajes.forEach(mensaje => {
      this.mostrarAlerta(mensaje);
    });
  }
  
  mostrarAlerta(mensaje: string) {
    console.log('Mostrando alerta:', mensaje);
    this.mensajeAlerta = mensaje;
    this.mostrarAlertaActiva = true;
  }
  
  ocultarAlerta() {
    this.mostrarAlertaActiva = false;
  }
  
  
  mostrarError(mensaje: string) {
    console.error(mensaje);
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 9000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  onChangeFicha() {
    this.getAsistencia();
  }
}
