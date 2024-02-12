import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlogService } from '../services/blog.service'; 

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  newsList: any[] = [];
  newBlog: any = { titulo: '', urlImagen: '', comentario: '', fecha: '', idUsuario: '', idFicha: '' };
  editingBlog: any | null = null;

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    const blogsPorFicha = this.blogService.getBlogsPorFicha();

    if (blogsPorFicha) {
      blogsPorFicha.subscribe(data => {
        this.newsList = data;
      });
    } else {
      // Manejo de error: No se pudo obtener la lista de blogs por ficha
    }
  }

  createBlog(form: NgForm) {
    if (form.valid) {
      this.blogService.crearBlog(this.newBlog)
        .subscribe(() => {
          this.loadBlogs();
          this.newBlog = { titulo: '', urlImagen: '', comentario: '', fecha: '', idUsuario: '', idFicha: '' };
        });
    }
  }

  editBlog(blog: any) {
    this.editingBlog = { ...blog };
  }

  cancelEdit() {
    this.editingBlog = null;
  }

  updateBlog() {
    this.blogService.editarBlog(this.editingBlog.identificador, this.editingBlog)
      .subscribe(() => {
        this.loadBlogs();
        this.editingBlog = null;
      });
  }

  deleteBlog(blogId: number) {
    this.blogService.eliminarBlog(blogId)
      .subscribe(() => {
        this.newsList = this.newsList.filter(blog => blog.identificador !== blogId);
      });
  }
}
