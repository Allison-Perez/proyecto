import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HorarioService } from '../services/horarios.service';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  fichas: any[] = [];
  newsList: any[] = [];
  selectedFicha: number | undefined;
  newHorario: any = { nombre: '', comentario: '' };
  selectedFile: File | null = null;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;
  editingHorario: any = null;

  constructor(private horarioService: HorarioService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loadHorario();
    this.loadFichas();
    this.getFichasUsuario()
  }

  toggleProfileMenu() {
    console.log(this.mostrarMenuPerfil);
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

  loadHorario() {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    this.horarioService.getHorarios().subscribe(
      data => {
        this.newsList = data;
      },
      error => {
        console.error('Error al cargar los horarios:', error);
      }
    );    
  }

  getFichasUsuario(): void {
    this.horarioService.getFichasUsuario().subscribe(
      (data: any[]) => {
        this.fichas = data;
      },
      error => {
        console.error('Error al cargar las fichas del usuario:', error);
      }
    );
  }

  loadFichas() {
    this.horarioService.getFichasUsuario().subscribe(
      data => {
        this.fichas = data;
        if (this.fichas.length > 0) {
          this.selectedFicha = this.fichas[0].identificador;
          this.loadHorario();
        }
      },
      error => {
        console.error('Error al cargar las fichas:', error);
      }
    );
  }
  
  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  crearHorario() {
    const formData = new FormData();

    formData.append('nombre', this.newHorario.nombre);
    formData.append('comentario', this.newHorario.comentario);
    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile);
    } else {
      console.error('No se seleccionó ningún archivo');
      return;
    }

    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      formData.append('idUsuario', userInfo.idUsuario);
      if (this.selectedFicha !== undefined) {
        formData.append('idFicha', this.selectedFicha.toString()); 
      } else {
        console.error('No se ha seleccionado una ficha');
        return;
      }
    } else {
      console.error('No se pudo obtener la información del usuario del token JWT');
      return;
    }

    formData.append('fechaPublicacion', new Date().toISOString());

    this.horarioService.crearHorario(formData).subscribe(
      (response) => {
        console.log('Horario creado exitosamente:', response);
        this.newsList.unshift(response);
        this.loadHorario();
        this.resetNewHorarioForm();
      },
      (error) => {
        console.error('Error al crear el horario:', error);
      }
    );
  }

  resetNewHorarioForm() {
    this.newHorario = { nombre: '', comentario: '' };
    this.selectedFile = null;
    this.selectedFicha = 0;
  }

  editarHorario(horario: any) {
    this.editingHorario = { ...horario };
  }

  guardarEdicion() {
    this.horarioService.editarHorario(this.editingHorario.identificador, this.editingHorario).subscribe(
      (response) => {
        console.log('Horario editado exitosamente:', response);
        this.loadHorario();
        this.cancelarEdicion();
      },
      (error) => {
        console.error('Error al editar el horario:', error);
      }
    );
  }

  cancelarEdicion() {
    this.editingHorario = null;
  }

  eliminarHorario(horarioId: number) {
    this.horarioService.eliminarHorario(horarioId).subscribe(
      (response) => {
        console.log('Horario eliminado exitosamente:', response);
        this.loadHorario();
      },
      (error) => {
        console.error('Error al eliminar el horario:', error);
      }
    );
  }

  descargarArchivo(archivoUrl: string, nombreArchivo: string) {
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
  }
}
