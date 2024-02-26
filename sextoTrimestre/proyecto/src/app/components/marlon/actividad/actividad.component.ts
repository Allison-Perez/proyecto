import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivityService } from '../services/actividad.service';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';

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

  constructor(private actividadService: ActivityService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
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
    this.actividadService.getActivities().subscribe(
      (data) => {
        this.activityList = data;
      },
      (error) => {
        console.error('Error al cargar las actividades:', error);
        this.errorMessage = 'Error al cargar las actividades.';
      }
    );
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createActivity(form: NgForm) {
    if (form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.newActivity.nombre);
      formData.append('comentario', this.newActivity.comentario);
      formData.append('fechaInicio', this.newActivity.fechaInicio);
      formData.append('fechaFinal', this.newActivity.fechaFin);
      formData.append('archivo', this.selectedFile);

      const userInfo = this.authService.getUserInfo();
      if (userInfo) {
        formData.append('idUsuario', userInfo.idUsuario);
        formData.append('idFicha', userInfo.idFicha);
      } else {
        this.errorMessage = 'No se pudo obtener la información del usuario del token JWT';
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
    this.newActivity = { nombre: '', comentario: '', fechaInicio: '', fechaFin: '' };
    this.selectedFile = null;
  }

  editActivity(activity: any) {
    this.editingActivity = { ...activity };
  }

  cancelEdit() {
    this.editingActivity = null;
  }

  updateActivity() {
    if (this.editingActivity) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.editingActivity.nombre);
      formData.append('comentario', this.editingActivity.comentario);
      formData.append('fechaInicio', this.editingActivity.fechaInicio);
      formData.append('fechaFinal', this.editingActivity.fechaFin);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }

      this.actividadService.updateActivity(this.editingActivity.id, formData).subscribe(
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
