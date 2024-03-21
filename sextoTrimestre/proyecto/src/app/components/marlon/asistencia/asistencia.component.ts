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
  alertas: string[] = [];
  aprendizId: string = '';
  mostrarAlertaActiva: boolean = false;
  mensajeAlerta: string = '';
  mostrarAvisoTresFallas: boolean = false;
  mostrarAvisoCincoFallas: boolean = false;
  noAsistioConsecutivas: number = 0;

  @ViewChild('tablaAsistencias') tablaAsistencias!: ElementRef;

  constructor(private asistenciaService: AsistenciaService, private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {
    this.mostrarAlertaActiva = false;
    this.errorMensaje = null;
  }

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

      // Agregar console.log para verificar que la función se está llamando adecuadamente
      console.log('verificarFallasConsecutivasYEnviarAlerta() llamada correctamente.');
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
      this.verificarAprendicesConFallas(this.asistenciaList); 
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
        this.verificarFallasConsecutivasYEnviarAlerta();
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
  
  verificarFallasConsecutivasYEnviarAlerta() {
    const mensajesAlerta: string[] = [];
    const fallasObservables: Observable<any>[] = [];
    const aprendicesIds: number[] = [];
  
    for (const asistencia of this.asistenciaList) {
      const aprendizId = asistencia.idAprendiz;
      aprendicesIds.push(aprendizId);
    }
  
    const fallasObservable = this.asistenciaService.obtenerFallasConsecutivasMultiple(aprendicesIds);
    fallasObservables.push(fallasObservable);
  
    forkJoin(fallasObservables).subscribe((result: any[]) => {
      const fallas = result[0]; // Assuming result is an array with a single element
  
      this.asistenciaList.forEach((asistencia, index) => {
        console.log('Fallas consecutivas para aprendiz', asistencia.nombreAprendiz, ':', fallas[index]);
  
        const aprendiz = this.asistenciaList[index];
        const fallasConsecutivas = fallas[index]?.fallasConsecutivas || 0;
        aprendiz.fallasConsecutivas = fallasConsecutivas; 
  
        if (fallasConsecutivas >= 3 && fallasConsecutivas < 5) {
          let mensaje = `El/La aprendiz ${aprendiz.nombreAprendiz} tiene ${fallasConsecutivas} fallas consecutivas y está en inicio de deserción.`;
          mensajesAlerta.push(mensaje);
        } else if (fallasConsecutivas >= 5) {
          let mensaje = `El/La aprendiz ${aprendiz.nombreAprendiz} tiene ${fallasConsecutivas} fallas consecutivas y está en proceso avanzado de deserción.`;
          mensajesAlerta.push(mensaje);
        }
      });
  
      if (mensajesAlerta.length > 0) {
        this.mostrarAlertaMultiple(mensajesAlerta);
      }
    }, error => {
      console.error('Error al obtener las fallas consecutivas:', error);
      this.mostrarError('Error al obtener las fallas consecutivas. Por favor, inténtalo de nuevo.');
    });
  }
  
   

  verificarAprendicesConFallas(aprendices: any[]) {
    const aprendicesConFallas = aprendices.filter(aprendiz => {
      return aprendiz.status === 'No Asistió' && (aprendiz.fallasConsecutivas >= 3 || aprendiz.fallasConsecutivas >= 5);
    });
  
    if (aprendicesConFallas.length > 0) {
      const mensajesAlerta: string[] = [];
      aprendicesConFallas.forEach(aprendiz => {
        const aprendizId = aprendiz.idAprendiz;
        this.asistenciaService.obtenerFallasConsecutivasMultiple([aprendizId]).subscribe(fallas => {
          const mensaje = `El aprendiz ${aprendiz.nombreAprendiz} tiene ${fallas} fallas consecutivas.`;
          mensajesAlerta.push(mensaje);
          if (mensajesAlerta.length === aprendicesConFallas.length) {
            this.mostrarAlertaMultiple(mensajesAlerta);
          }
        }, error => {
          console.error('Error al obtener las fallas:', error);
          this.mostrarError('Error al obtener las fallas. Por favor, inténtalo de nuevo.');
        });
      });
    }
  }
  
  mostrarAlertaMultiple(mensajes: string[]) {
    console.log('Mostrando alertas múltiples:', mensajes);
    this.alertas = mensajes;
    this.mostrarAlertaActiva = mensajes.length > 0;
  }
  
  mostrarAlerta(mensaje: string) {
    console.log('Mostrando alerta:', mensaje);
    this.alertas.push(mensaje);
    this.mostrarAlertaActiva = true; 
  }
  
  ocultarAlerta() {
    console.log('Ocultando alertas');
    this.mostrarAlertaActiva = false;
    this.alertas = [];
  }
  
  mostrarError(mensaje: string) {
    console.error(mensaje);
    this.errorMensaje = mensaje;
  }

  onChangeFicha() {
    this.getAsistencia();
  }
}
