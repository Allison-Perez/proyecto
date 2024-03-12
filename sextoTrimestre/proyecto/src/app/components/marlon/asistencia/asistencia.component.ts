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
  selectedAsistencia: any;
  editandoAsistencia: boolean = false;

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

  async submitForm() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined && this.idUsuario !== null) {
      await this.crearOActualizarAsistencia();
      this.getAsistencia();
    } else {
      console.error('Error: Fecha, ficha o idUsuario no están definidos.');
    }
  }

  async crearOActualizarAsistencia() {
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined) {
      const userInfo = this.authService.getUserInfo();
      const idUsuario = userInfo.idUsuario;
      const idInstructor = userInfo.idUsuario;
  
      if (idUsuario !== undefined && idUsuario !== null && idInstructor !== undefined && idInstructor !== null) {
        const existeAsistencia = await this.asistenciaService.verificarAsistencia(this.newAsistencia.fecha, this.selectedFicha).toPromise();
  
        if (!existeAsistencia) {
          await this.asistenciaService.crearAsistencia(this.newAsistencia.fecha, this.selectedFicha, idUsuario, idInstructor).toPromise();
        }
        this.getAsistencia();
      } else {
        console.error('Error: idUsuario o idInstructor no definidos.');
      }
    } else {
      console.error('Error: Fecha o ficha no están definidos.');
    }
  }
  
  getAsistencia() {
    console.log('Parámetros de búsqueda:', this.newAsistencia.fecha, this.selectedFicha, this.idUsuario);
    if (this.newAsistencia.fecha && this.selectedFicha !== undefined && this.idUsuario !== null) {
      this.asistenciaService.getAsistencia(this.newAsistencia.fecha, this.idUsuario, this.selectedFicha)
        .subscribe((data: any[]) => {
          console.log('Datos de asistencia recibidos:', data);
          if (data && data.length > 0) {
            this.asistenciaList = data;
          } else {
            console.log('No se encontraron datos de asistencia.');
          }
        }, error => {
          console.error('Error al obtener asistencia:', error);
        });
    } else {
      console.error('Error: Fecha, idUsuario o ficha no están definidos.');
    }
  }  
   

  getFichasUsuario() {
    this.asistenciaService.getFichasUsuario().subscribe((data: any[]) => {
      console.log('Fichas de usuario recibidas:', data);
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
    this.editandoAsistencia = true;
    this.selectedAsistencia = asistencia;
  }
  
  cancelarEdicion() {
    this.editandoAsistencia = false;
  }
  
  async actualizarAsistencia() {
    if (this.selectedAsistencia && this.selectedAsistencia.identificador) {
      console.log('Actualizando asistencia:', this.selectedAsistencia);
      const status = this.selectedAsistencia.status; 
      const updatedData = { status: status, fallaJustificada: this.selectedAsistencia.fallaJustificada };
      console.log('Datos actualizados:', updatedData);
      await this.asistenciaService.editarAsistencia(this.selectedAsistencia.identificador, updatedData).toPromise();

      const index = this.asistenciaList.findIndex(asistencia => asistencia.identificador === this.selectedAsistencia.identificador);
      if (index !== -1) {
        this.asistenciaList[index] = await this.asistenciaService.getAsistenciaById(this.selectedAsistencia.identificador).toPromise();
      }
  
      console.log('Asistencia actualizada correctamente.');
  
      this.getAsistencia();
    } else {
      console.error('Error: Asistencia no seleccionada o identificador no definido.');
    }
  }
  
  // Método para manejar el cambio de la ficha seleccionada
  onChangeFicha() {
    this.getAsistencia();
  }
}
