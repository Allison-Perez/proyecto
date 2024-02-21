import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-blog',
  templateUrl: './ver-blog.component.html',
  styleUrls: ['./ver-blog.component.scss']
})
export class VerBlogComponent {
  newsList: any[] = [];
  newBlog: any = { titulo: '', comentario: '', imagenOpcional: null };
  imageFile: File | null = null;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private authService: AuthService, private serviceService: ServiceService, private router: Router) { }

  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    this.loadBlogs();
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

  loadBlogs() {
    const idFicha = 1;
    this.serviceService.getBlogsPorFicha(idFicha).subscribe(
      data => {
        this.newsList = data;
      },
      error => {
        console.error('Error al cargar los blogs:', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
}
