import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-blog',
  templateUrl: './ver-blog.component.html',
  styleUrls: ['./ver-blog.component.scss']
})
export class VerBlogComponent implements OnInit {
  newsList: any[] = [];
  mostrarMenuPerfil: boolean = false;
  isMenuOpen: boolean = false;


  constructor(private authService: AuthService, private serviceService: ServiceService, private router: Router) { }

  ngOnInit() {
    this.loadBlogs();
  }

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
    this.mostrarMenuPerfil = false; // Cierra el menú después de redirigir
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  loadBlogs() {
    const idFicha = this.authService.getUserInfo()?.idFicha;
  
    if (idFicha !== undefined) {
      this.serviceService.getblogsFicha(idFicha).subscribe(
        data => this.newsList = data,
        error => console.error('Error al cargar los blogs:', error)
      );
    } else {
      console.error('IdFicha no válida.');
    }
  }
    
}  
