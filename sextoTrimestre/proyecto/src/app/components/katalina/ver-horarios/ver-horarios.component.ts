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
  newsList: any[] = []; 
  imageFile: File | null = null;
  newHorario: any = { nombre: '', comentario: '' };
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
//   ngOnInit(): void {
//     this.loadhorario();
//   }

//   loadhorario() {
//     const idFicha = 1;
  
//     if (idFicha !== undefined) {
//       this.ServiceService.gethorarioFicha(idFicha).subscribe(
//         data => {
//           console.log('Blogs loaded successfully:', data);
//           this.newsList = data;
//         },
//         error => console.error('Error al cargar los blogs:', error)
//       );
//     } else {
//       console.error('IdFicha no válida.');
//     }
//   }
  
//   descargarArchivo(archivoUrl: string, nombreArchivo: string) {
//     const url = `http://localhost:3000${archivoUrl}`;
//     const link = document.createElement('a');
//     link.href = url;
//     link.target = '_blank';
//     link.download = nombreArchivo; 
//     document.body.appendChild(link);
//     link.click();
// }
}
