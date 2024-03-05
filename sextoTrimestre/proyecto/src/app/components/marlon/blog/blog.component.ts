import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlogService } from '../services/blog.service';
import { AuthService } from '../../allison/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  newsList: any[] = [];
  newBlog: any = { nombre: '', comentario: '', imagenOpcional: null };
  imageFile: File | null = null;
  editingBlog: any = null;
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;
  userFichas: any[] = [];
  fichas: any[] = [];
  selectedFicha: any;

  constructor(private blogService: BlogService, private router: Router, private authService: AuthService) { }
  
  ngOnInit() {
    this.userFichas = this.authService.getUserFichas();
    this.getFichasUsuario();
    this.loadBlogs();
  }

  transformUrl(url: string): string {
    if (url) {
      return 'assets/' + url.replace(/\\/g, '/');
    }
    return 'assets/uploads/Blog.png';
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

  getFichasUsuario(): void {
    this.blogService.getFichasUsuario().subscribe(
      (data: any[]) => {
        this.fichas = data;
      },
      error => {
        console.error('Error al cargar las fichas del usuario:', error);
      }
    );
  }

  onSelectFicha(event: any): void {
    this.selectedFicha = event.target.value;
  }  
  
  loadBlogs() {
    console.log('Cargando todos los blogs');
    const idUsuario = this.authService.getUserInfo().idUsuario;
    this.blogService.getBlogsPorUsuario(idUsuario).subscribe(
      data => {
        this.newsList = data;
      },
      error => {
        console.error('Error al cargar los blogs:', error);
      }
    );
  }

  crearBlog() {
    if (!this.selectedFicha) {
      console.error('No se ha seleccionado ninguna ficha');
      return;
    }
    
    const idFichaSeleccionada = this.selectedFicha;

    const formData = new FormData();
    formData.append('nombre', this.newBlog.nombre);
    formData.append('comentario', this.newBlog.comentario);
    if (this.imageFile) {
      formData.append('imagenOpcional', this.imageFile, this.imageFile.name);
    }
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      formData.append('idUsuario', userInfo.idUsuario.toString());
      formData.append('idFicha', idFichaSeleccionada.toString()); 

    } else {
      console.error('No se pudo obtener la información del usuario del token JWT');
      return;
    }
    formData.append('fechaPublicacion', new Date().toISOString());
  
    this.blogService.crearBlog(formData).subscribe(
      (response) => {
        console.log('Blog creado exitosamente:', response);
        this.newsList.unshift(response);
        this.loadBlogs();
        this.resetNewBlogForm();
      },
      (error) => {
        console.error('Error al crear el blog:', error);
      }
    );
  }
  
   

  resetNewBlogForm() {
    console.log('resetea blog');

    this.newBlog = { nombre: '', comentario: '', imagenOpcional: null };
    this.imageFile = null;
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  editBlog(blog: any) {
    this.editingBlog = blog;
  }

  deleteBlog(blogId: number) {
    this.blogService.eliminarBlog(blogId).subscribe(
      () => {
        console.log('Blog eliminado correctamente');
        this.newsList = this.newsList.filter(blog => blog.identificador !== blogId);
      },
      (error) => {
        console.error('Error al eliminar el blog:', error);
      }
    );
  }


  updateBlog() {
    if (this.editingBlog) {
      this.blogService.editarBlog(this.editingBlog.identificador, this.editingBlog).subscribe(
        () => {
          console.log('Blog actualizado correctamente');
          this.loadBlogs();
          this.cancelEdit();
        },
        (error) => {
          console.error('Error al actualizar el blog:', error);
        }
      );
    }
  }

  cancelEdit() {
    this.editingBlog = null;
  }

  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }
}

