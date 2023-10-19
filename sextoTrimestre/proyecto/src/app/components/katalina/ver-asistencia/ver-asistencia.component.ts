import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-ver-asistencia',
  templateUrl: './ver-asistencia.component.html',
  styleUrls: ['./ver-asistencia.component.css']
})
export class VerAsistenciaComponent {
  asistenciaList: any[] = [];
  newAsistencia: any = { nombreArchivo: '', comentario: '' };
  editingAsistencia: any | null = null;
  selectedFile: File | null = null;

  constructor(private ServiceService: ServiceService) {}

  ngOnInit() {
    this.loadAsistencia();
  }

  loadAsistencia() {
    this.ServiceService.getAsistencia().subscribe((data) => {
      this.asistenciaList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  updateAsistencia() {
    if (this.editingAsistencia) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.editingAsistencia.nombreArchivo);
      formData.append('comentario', this.editingAsistencia.comentario);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }
      
      this.ServiceService.updateAsistencia(this.editingAsistencia.id, formData).subscribe(
        () => {
          this.loadAsistencia();
          this.editingAsistencia = null;
          this.selectedFile = null; 
        },
        (error) => {
          console.error('Error al actualizar asistencia:', error);
          
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
