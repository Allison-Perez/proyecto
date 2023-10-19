import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-ver-horarios',
  templateUrl: './ver-horarios.component.html',
  styleUrls: ['./ver-horarios.component.css']
})
export class VerHorariosComponent {
  horarioList: any[] = [];
  newHorario: any = { nombreArchivo: '', comentario: '' };
  editingHorario: any | null = null;
  selectedFile: File | null = null;

  constructor(private ServiceService : ServiceService ) {}

  ngOnInit() {
    this.loadHorario();
  }

  loadHorario() {
    this.ServiceService .getHorario().subscribe((data) => {
      this.horarioList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateHorario() {
    if (this.editingHorario) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.editingHorario.nombreArchivo);
      formData.append('comentario', this.editingHorario.comentario);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }
      
      this.ServiceService .updateHorario(this.editingHorario.id, formData).subscribe(
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
  


  descargarArchivo(archivoUrl: string) {
    // Construye la URL del servidor para descargar el archivo
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }
}
