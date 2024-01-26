import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-ver-actividad',
  templateUrl: './ver-actividad.component.html',
  styleUrls: ['./ver-actividad.component.scss']
})
export class VerActividadComponent {
  activityList: any[] = [];
  newActivity: any = { nombreArchivo: '', comentario: '' };
  editingActivity: any | null = null;
  selectedFile: File | null = null;
  isMenuOpen: boolean = false;

  constructor(private ServiceService: ServiceService) {}

  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }  

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.ServiceService.getActivities().subscribe((data) => {
      this.activityList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateActivity() {
    if (this.editingActivity) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.editingActivity.nombreArchivo);
      formData.append('comentario', this.editingActivity.comentario);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }

      this.ServiceService.updateActivity(this.editingActivity.id, formData).subscribe(
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

  descargarArchivo(archivoUrl: string) {
    // Construye la URL del servidor para descargar el archivo
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

}

