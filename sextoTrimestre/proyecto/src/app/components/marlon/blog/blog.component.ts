import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlogService } from '../services/blog.service';
import { AuthService } from '../../allison/service/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  newsList: any[] = [];
  newBlog: any = { titulo: '', comentario: '', imagenOpcional: null };
  imageFile: File | null = null;
  editingBlog: any = null;
  isMenuOpen: boolean = false;

  constructor(private blogService: BlogService, private authService: AuthService) { }
  ngOnInit() {
    this.loadBlogs();
  }

  transformUrl(url: string): string {
    if (url) {
      return 'assets/' + url.replace(/\\/g, '/');
    }
    return 'assets/uploads/Blog.png';
  }

  loadBlogs() {
    const fichas = this.authService.getUserFichas();
    if (fichas && fichas.length > 0) {
      this.newsList = [];
      fichas.forEach(ficha => {
        this.blogService.getBlogsPorFicha(ficha).subscribe(
          data => {
            this.newsList.push(...data);
          },
          error => {
            console.error('Error al cargar los blogs:', error);
          }
        );
      });
    } else {
      console.error('El usuario no tiene fichas asociadas');
    }
  }

  crearBlog() {
    const formData = new FormData();
    formData.append('nombre', this.newBlog.nombre);
    formData.append('comentario', this.newBlog.comentario);
    if (this.imageFile) {
      formData.append('imagenOpcional', this.imageFile, this.imageFile.name);
    }
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      formData.append('idUsuario', userInfo.idUsuario);
      formData.append('idFicha', userInfo.idFicha);
    } else {
      console.error('No se pudo obtener la información del usuario del token JWT');
      return;
    }
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
