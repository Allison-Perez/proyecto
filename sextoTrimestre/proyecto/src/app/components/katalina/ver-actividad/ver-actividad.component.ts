import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ver-actividad',
  templateUrl: './ver-actividad.component.html',
  styleUrls: ['./ver-actividad.component.scss']
})
export class VerActividadComponent {
  email: string = '';
  userInfo: any;
  guias: any;
  newsList: any[] = [];
  mostrarMenuPerfil: boolean = false;
  isMenuOpen: boolean = false;
  


  constructor(private ServiceService: ServiceService, private authService: AuthService, private router: Router) {}

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

  ngOnInit(): void {
    this.email = this.authService.getUserEmail();
    this.getUserInfo();
    this.getGuias();
  }

  getUserInfo() {
    const idguia = 1;

    this.ServiceService.getUserInfoByguias(idguia).subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.error('Error al obtener información del usuario por guias:', error);
      }
    );
  }


  getGuias() {
    this.ServiceService.getguias(this.email).subscribe(
      (data) => {
        this.guias = data;
      },
      (error) => {
        console.error('Error al obtener guias por correo:', error);
      }
    );
  }


  descargarArchivo(archivoUrl: string, nombreArchivo: string) {
    const url = `http://localhost:3000${archivoUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
  }
  
  formatDate(date: Date): string {
    // Implement your date formatting logic here
    return ''; // Replace with your actual implementation
  }
}