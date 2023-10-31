import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/actividad.service';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css'],
})
export class ActividadComponent implements OnInit {
  activityList: any[] = [];
  newActivity: any = { nombreArchivo: '', comentario: '' };
  editingActivity: any | null = null;
  selectedFile: File | null = null;

  constructor(private actividadService: ActivityService) {}

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.actividadService.getActivities().subscribe((data) => {
      this.activityList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
createActivity() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('nombreArchivo', this.newActivity.nombreArchivo);
    formData.append('comentario', this.newActivity.comentario);
    formData.append('archivo', this.selectedFile);

    this.actividadService.createActivity(formData).subscribe(
      () => {
        this.loadActivities();
        this.newActivity = { nombreArchivo: '', comentario: '' };
        this.selectedFile = null;
      },
      (error) => {
        console.error('Error al crear actividad:', error);
       
      }
    );
  } else {
    console.log('No se ha seleccionado ningún archivo.');
  
  }
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
      formData.append('nombreArchivo', this.editingActivity.nombreArchivo);
      formData.append('comentario', this.editingActivity.comentario);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }
      
      this.actividadService.updateActivity(this.editingActivity.id_guia, formData).subscribe(
        () => {
          this.loadActivities();
          this.editingActivity = null;
          this.selectedFile = null; 
        },
        (error) => {
          console.error('Error al actualizar actividad:', error);
          
        }
      );
    }
  }
  

  deleteActivity(activityId: string) {
    this.actividadService.deleteActivity(activityId).subscribe(() => {
      this.loadActivities();
    });
  }

  descargarArchivo(archivoUrl: string) {
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

}
