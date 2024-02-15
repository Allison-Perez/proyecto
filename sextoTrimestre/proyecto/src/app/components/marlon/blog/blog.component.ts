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
  newBlog: any = { titulo: '', comentario: '' };
  imageFile: File | null = null;
  editingBlog: any = null;

  constructor(private blogService: BlogService, private authService: AuthService) { }

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    // Modificar para obtener blogs según la ficha del usuario actual
    const idFicha = 1; // Cambiar esto para obtener la ficha del usuario actual
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
    if (this.newBlog.titulo && this.newBlog.comentario) {
      const formData = new FormData();
      formData.append('titulo', this.newBlog.titulo);
      formData.append('comentario', this.newBlog.comentario);
      
      // Verificar que this.imageFile no sea null antes de agregarlo al FormData
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }
  
      // Modificar para enviar la fecha actual, ID de usuario y ID de ficha
      formData.append('fecha', new Date().toISOString());
      formData.append('idUsuario', '2'); // Cambiar esto para obtener el ID del usuario actual
      formData.append('idFicha', '1'); // Cambiar esto para obtener el ID de la ficha del usuario actual
  
      this.blogService.crearBlog(formData).subscribe(
        (response) => {
          console.log('Blog creado exitosamente:', response);
          this.loadBlogs(); 
          this.resetNewBlogForm(); 
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
    this.newBlog = { titulo: '', comentario: '' };
    this.imageFile = null;
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  editBlog(blog: any) {
    this.editingBlog = blog;
  }

  deleteBlog(blogId: number) {
    // Lógica para eliminar un blog
  }

  updateBlog() {
    // Lógica para actualizar un blog
  }

  cancelEdit() {
    this.editingBlog = null;
  }
}
