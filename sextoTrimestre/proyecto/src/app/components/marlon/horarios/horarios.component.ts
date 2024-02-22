import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HorarioService } from '../services/horarios.service';
import { AuthService } from '../../allison/service/auth.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  horarioList: any[] = [];
  newHorario: any = { nombre: '', comentario: '' };
  selectedFile: File | null = null;

  constructor(private horarioService: HorarioService, private authService: AuthService) {}

  ngOnInit() {
    this.loadHorario();
  }

  loadHorario() {
    this.horarioService.getHorarios().subscribe((data) => {
      this.horarioList = data;
    });
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createHorario(form: NgForm) {
    if (form.valid && this.selectedFile) {
      const formData = this.createFormData();
      if (formData) {
        this.horarioService.crearHorario(formData, this.selectedFile).subscribe(
          () => {
            this.resetForm(form);
            this.loadHorario();
          },
          (error) => {
            console.error('Error al crear horario:', error);
          }
        );
      } else {
        console.error('No se pudo crear el FormData.');
      }
    } else {
      console.log('Por favor, completa todos los campos.');
    }
  }
  
  private createFormData(): FormData | null {
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) {
      console.error('No se pudo obtener la información del usuario');
      return null;
    }
    
    const formData = new FormData();
    formData.append('nombre', this.newHorario.nombre);
    formData.append('comentario', this.newHorario.comentario);
    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile);
    }
    formData.append('idUsuario', userInfo.idUsuario);
    formData.append('idFicha', userInfo.idFicha);
    return formData;
  }
  

  private resetForm(form: NgForm) {
    form.resetForm();
    this.newHorario = { nombre: '', comentario: '' };
    this.selectedFile = null;
  }

  editHorario(horario: any) {
    // Implementa la lógica para editar un horario si es necesario
  }

  deleteHorario(horarioId: string) {
    // Implementa la lógica para eliminar un horario si es necesario
  }
  
  descargarArchivo(archivoUrl: string) {
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }
}
