import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ver-horarios',
  templateUrl: './ver-horarios.component.html',
  styleUrls: ['./ver-horarios.component.scss']
})
export class VerHorariosComponent {
  horarioList: any[] = [];
  newHorario: any = { nombreArchivo: '', comentario: '' };
  editingHorario: any | null = null;
  selectedFile: File | null = null;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private ServiceService: ServiceService, private authService: AuthService, private router: Router ) {}

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
