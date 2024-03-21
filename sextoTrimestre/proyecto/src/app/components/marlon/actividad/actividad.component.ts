import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivityService } from '../services/actividad.service';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css'],
})
export class ActividadComponent implements OnInit {
  activityList: any[] = [];
  newActivity: any = { nombre: '', comentario: '', fechaInicio: '', fechaFin: '' };
  selectedFile: File | null = null;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;
  editingActivity: any | null = null;
  errorMessage: string = '';
  fichas: any[] = [];
  selectedFicha: number | undefined;

  constructor(private actividadService: ActivityService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadFichas();
    this.loadActivities();
  }

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

  loadActivities() {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    this.actividadService.getActivities().subscribe(
      data => {
        this.activityList = data;
      },
      error => {
        console.error('Error al cargar los horarios:', error);
      }
    );    
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getFichasUsuario(): void {
    this.actividadService.getFichasUsuario().subscribe(
      (data: any[]) => {
        this.fichas = data;
      },
      error => {
        console.error('Error al cargar las fichas del usuario:', error);
      }
    );
  }

  loadFichas() {
    this.actividadService.getFichasUsuario().subscribe(
      data => {
        this.fichas = data;
        if (this.fichas.length > 0) {
          this.selectedFicha = this.fichas[0].identificador;
          this.loadActivities();
        }
      },
      error => {
        console.error('Error al cargar las fichas:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }
  

  createActivity(form: NgForm) {
    if (form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nombre', this.newActivity.nombre);
      formData.append('comentario', this.newActivity.comentario);
      formData.append('fechaInicio', this.newActivity.fechaInicio);
      formData.append('fechaFinal', this.newActivity.fechaFinal);
      formData.append('archivo', this.selectedFile);
  
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
  
      this.actividadService.createActivity(formData).subscribe(
        () => {
          this.loadActivities();
          this.resetNewActivityForm();
        },
        (error) => {
          console.error('Error al crear la actividad:', error);
          this.errorMessage = 'Error al crear la actividad.';
        }
      );
    } else {
      this.errorMessage = 'Diligenciar todos los campos.';
    }
  }


  resetNewActivityForm() {
    this.newActivity = { nombre: '', comentario: '', fechaInicio: '', fechaFinal: '' };
    this.selectedFile = null;
  }

  editActivity(activity: any) {
    this.editingActivity = { ...activity };
  }

  cancelEdit() {
    this.editingActivity = null;
  }

  updateActivity(idActividad: string) {
    if (this.editingActivity) {
      const idNumber: number = parseInt(idActividad, 10);
  
      this.actividadService.updateActivity(idNumber, this.editingActivity).subscribe(
        () => {
          this.loadActivities();
          this.cancelEdit();
        },
        (error) => {
          console.error('Error al actualizar la actividad:', error);
          this.errorMessage = 'Error al actualizar la actividad.';
        }
      );
    }
  }
  

  deleteActivity(activityId: string) {
    const idNumber: number = parseInt(activityId, 10);
    this.actividadService.deleteActivity(idNumber).subscribe(() => {
      this.loadActivities();
      },
      (error) => {
        console.error('Error al eliminar la actividad:', error);
        this.errorMessage = 'Error al eliminar la actividad.';
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
