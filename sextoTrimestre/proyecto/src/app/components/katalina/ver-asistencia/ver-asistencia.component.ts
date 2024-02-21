import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-asistencia',
  templateUrl: './ver-asistencia.component.html',
  styleUrls: ['./ver-asistencia.component.scss']
})
export class VerAsistenciaComponent {
  asistenciaList: any[] = [];
  newAsistencia: any = { nombreArchivo: '', comentario: '' };
  editingAsistencia: any | null = null;
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

  ngOnInit() {
    this.loadAsistencia();
  }

  loadAsistencia() {
    this.ServiceService.getAsistencia().subscribe((data) => {
      this.asistenciaList = data;
    });
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
