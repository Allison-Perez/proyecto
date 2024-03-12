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
  email: string = '';
  userInfo: any; 
  horarios: any; 
  newsList: any[] = [];
  mostrarMenuPerfil: boolean = false;
  isMenuOpen: boolean = false;

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
  ngOnInit(): void {
    this.email = this.authService.getUserEmail();
    this.getUserInfo();
    this.getHorarios();
  }
  
  getUserInfo() {
    const idHorario = 1;
  
    this.ServiceService.getUserInfoByHorario(idHorario).subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.error('Error al obtener información del usuario por horario:', error);
      }
    );
  }
  
  getHorarios() {
    this.ServiceService.getHorarios(this.email).subscribe(
      (data) => {
        this.horarios = data;
      },
      (error) => {
        console.error('Error al obtener horarios por correo:', error);
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
}
