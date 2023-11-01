import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  asistenciaList: any[] = [];
  newAsistencia: any = { nombreArchivo: '', comentario: '' };
  editingAsistencia: any | null = null;
  selectedFile: File | null = null;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    this.loadAsistencia();
  }

  loadAsistencia() {
    this.asistenciaService.getAsistencia().subscribe((data) => {
      this.asistenciaList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
createAsistencia() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('nombreArchivo', this.newAsistencia.nombreArchivo);
    formData.append('comentario', this.newAsistencia.comentario);
    formData.append('archivo', this.selectedFile);

    this.asistenciaService.createAsistencia(formData).subscribe(
      () => {
        this.loadAsistencia();
        this.newAsistencia = { nombreArchivo: '', comentario: '' };
        this.selectedFile = null;
      },
      (error) => {
        console.error('Error al crear asistencia:', error);
       
      }
    );
  } else {
    console.log('No se ha seleccionado ningún archivo.');
  
  }
}

  editAsistencia(asistencia: any) {
    this.editingAsistencia = { ...asistencia };
  }

  cancelEdit() {
    this.editingAsistencia = null;
  }

  updateAsistencia() {
    if (this.editingAsistencia) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.editingAsistencia.nombreArchivo);
      formData.append('comentario', this.editingAsistencia.comentario);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }
      
      this.asistenciaService.updateAsistencia(this.editingAsistencia.id_asistencia, formData).subscribe(
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
  

  deleteAsistencia(asistenciaId: string) {
    this.asistenciaService.deleteAsistencia(asistenciaId).subscribe(() => {
      this.loadAsistencia();
    });
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
