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
  newBlog: any = { titulo: '', urlImagen: '', comentario: '' };
  editingBlog: any | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private blogService: BlogService, private authService: AuthService) { }

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    const idFicha = 1; 
    this.blogService.getBlogsPorFicha(idFicha).subscribe(
      data => {
        this.newsList = data;
      },
      error => {
        console.error('Error al cargar los blogs:', error);
      }
    );
  }

  crearBlog() {
    if (this.newBlog.titulo && this.newBlog.urlImagen && this.newBlog.comentario) {
      const nuevoBlog = {
        titulo: this.newBlog.titulo,
        urlImagen: this.newBlog.urlImagen,
        comentario: this.newBlog.comentario,
        fecha: new Date().toISOString(), // Convertir la fecha a un formato compatible con el backend
        idUsuario: this.authService.getIdUsuarioActual(), // Obtener el ID del usuario autenticado desde el servicio AuthService
        idFicha: 1 // ID de la ficha relacionada con el blog
      };
  
      this.blogService.crearBlog(nuevoBlog).subscribe(
        (response) => {
          console.log('Blog creado exitosamente:', response);
          this.loadBlogs(); // Actualiza la lista de blogs después de crear uno nuevo
          this.resetNewBlogForm(); // Restablece el formulario para un nuevo blog
        },
        (error) => {
          console.error('Error al crear el blog:', error);
        }
      );
    } else {
      console.error('Faltan campos obligatorios para crear el blog');
    }
  }
  
  resetNewBlogForm() {
    this.newBlog = { titulo: '', urlImagen: '', comentario: '' };
    this.imagePreview = null;
  }

  editBlog(blog: any) {
    this.editingBlog = { ...blog };
  }

  cancelEdit() {
    this.editingBlog = null;
  }

  updateBlog() {
    if (this.editingBlog) {
      this.blogService.editarBlog(this.editingBlog.identificador, this.editingBlog)
        .subscribe(() => {
          this.loadBlogs();
          this.editingBlog = null;
        });
    }
  }

  deleteBlog(blogId: number) {
    this.blogService.eliminarBlog(blogId)
      .subscribe(() => {
        this.newsList = this.newsList.filter(blog => blog.identificador !== blogId);
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.newBlog.urlImagen = reader.result as string; // Asigna la URL de la imagen seleccionada al campo urlImagen
      };
      reader.readAsDataURL(file);
    }
  }
}
