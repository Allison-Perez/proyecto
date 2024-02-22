import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../services/horarios.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';

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
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false

  constructor(private horarioService: HorarioService, private router: Router, private authService: AuthService) {}
  
  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleProfileMenu() {
    console.log(this.mostrarMenuPerfil);

    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }
 redirectTo(route: string) {
    this.router.navigate([route]);
    // Cierra el menú después de redirigir
    this.mostrarMenuPerfil = false;
  }
  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
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
  
  createHorario(form: NgForm) {
    if (form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nombreArchivo', this.newHorario.nombreArchivo);
      formData.append('comentario', this.newHorario.comentario);
      formData.append('archivo', this.selectedFile);

      this.horarioService.createHorario(formData).subscribe(
        () => {
          this.loadHorario();
          this.newHorario = { nombreArchivo: '', comentario: '' };
          this.selectedFile = null;
          form.resetForm();
        },
        (error) => {
          console.error('Error al crear horario:', error);
        }
      );
    } else {
      console.log('Diligenciar todos los campos.');
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
      
      this.horarioService.updateHorario(this.editingHorario.id_horario, formData).subscribe(
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
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }
}
