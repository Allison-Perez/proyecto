// blog.component.ts
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

  constructor(private blogService: BlogService, private authService: AuthService) { }

  ngOnInit() {
    this.loadBlogs();
  }

  transformUrl(url: string): string {
  if (url) {
    return 'assets/' + url.replace(/\\/g, '/');
  }
  return 'assets/uploads/predeterminada.png'; 
}

loadBlogs() {
  const fichas = this.authService.getUserFichas(); 
  if (fichas && fichas.length > 0) {
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
  if (this.newBlog.titulo && this.newBlog.comentario) {
    const formData = new FormData();
    formData.append('titulo', this.newBlog.titulo);
    formData.append('comentario', this.newBlog.comentario);

    if (this.imageFile) {
      formData.append('imagenOpcional', this.imageFile);
    }

    formData.append('fecha', new Date().toISOString());

    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      console.log(userInfo);
      formData.append('idUsuario', userInfo.idUsuario);
      formData.append('idFicha', userInfo.idFicha);
    } else {
      console.error('No se pudo obtener la información del usuario del token JWT');
      return;
    }


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
    this.newBlog = { titulo: '', comentario: '', imagenOpcional: null };
    this.imageFile = null;
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  editBlog(blog: any) {
    this.editingBlog = blog;
  }

  deleteBlog(blogId: number) {
    
  }

  updateBlog() {
   
  }

  cancelEdit() {
    this.editingBlog = null;
  }
}
