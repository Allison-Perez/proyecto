import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../services/horarios.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  horarioList: any[] = [];
  newHorario: any = { nombreArchivo: '', comentario: '' };
  editingHorario: any | null = null;
  selectedFile: File | null = null;

  constructor(private horarioService: HorarioService) {}

  ngOnInit() {
    this.loadHorario();
  }

  loadHorario() {
    this.horarioService.getHorario().subscribe((data) => {
      this.horarioList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
createHorario() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('nombreArchivo', this.newHorario.nombreArchivo);
    formData.append('comentario', this.newHorario.comentario);
    formData.append('archivo', this.selectedFile);

    this.horarioService.createHorario(formData).subscribe(
      () => {
        this.loadHorario();
        this.newHorario = { nombreArchivo: '', comentario: '' };
        this.selectedFile = null;
      },
      (error) => {
        console.error('Error al crear horario:', error);
       
      }
    );
  } else {
    console.log('No se ha seleccionado ningún archivo.');
  
  }
}

  editHorario(horario: any) {
    this.editingHorario = { ...horario };
  }

  cancelEdit() {
    this.editingHorario = null;
  }

  updateHorario() {
    if (this.editingHorario) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.editingHorario.nombreArchivo);
      formData.append('comentario', this.editingHorario.comentario);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }
      
      this.horarioService.updateHorario(this.editingHorario.id, formData).subscribe(
        () => {
          this.loadHorario();
          this.editingHorario = null;
          this.selectedFile = null; 
        },
        (error) => {
          console.error('Error al actualizar horario:', error);
          
        }
      );
    }
  }
  

  deleteHorario(horarioId: string) {
    this.horarioService.deleteHorario(horarioId).subscribe(() => {
      this.loadHorario();
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
