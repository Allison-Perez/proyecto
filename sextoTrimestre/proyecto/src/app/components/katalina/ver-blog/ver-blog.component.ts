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
  email: string = '';
  userInfo: any;
  blogs: any;


  constructor(private authService: AuthService, private serviceService: ServiceService, private router: Router) { }

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
    this.mostrarMenuPerfil = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  ngOnInit(): void {
    this.email = this.authService.getUserEmail();
    this.getUserInfo();
    this.getBlogs();
  }

  getUserInfo() {
    const idBlog = 1;

    this.serviceService.getUserInfoByBlog(idBlog).subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.error('Error al obtener información del usuario por blog:', error);
      }
    );
  }


  getBlogs() {
    this.serviceService.getBlogs(this.email).subscribe(
      (data) => {
        this.blogs = data;
      },
      (error) => {
        console.error('Error al obtener blogs por correo:', error);
      }
    );
  }

}


