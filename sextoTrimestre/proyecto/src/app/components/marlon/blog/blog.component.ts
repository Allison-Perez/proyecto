import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service'; 

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  newsList: any[] = [];
  newNews: any = { titulo: '', contenido: '' };
  editingNews: any | null = null;

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.blogService.getNews().subscribe(data => {
      console.log('Datos de noticias:', data);
      if (data.length > 0) {
        console.log('Primer objeto:', data[0]);
      }
  
      this.newsList = data;
    });
  }

  createNews() {
    this.blogService.createNews(this.newNews).subscribe(() => {
      this.loadNews(); 
      this.newNews = { titulo: '', contenido: '' };
    });
  }

  editNews(news: any) {
    if (news && news.id_noticias) {
        console.log('Editar noticia ID:', news.id_noticias);
        this.editingNews = { ...news }; 
    } else {
        console.log('No se encontró un ID válido para editar la noticia.');
    }
  }

  cancelEdit() {
    this.editingNews = null;
  }

  updateNews() {
    this.blogService.updateNews(this.editingNews.id_noticias, this.editingNews).subscribe(() => {
      this.loadNews();
      this.editingNews = null;
    });
  }

  deleteNews(newsId: number) {
    if (newsId) {
      console.log('Eliminar noticia ID:', newsId);
      this.blogService.deleteNews(newsId.toString()).subscribe(() => {
        this.newsList = this.newsList.filter(news => news.id_noticias !== newsId);
      });
    } else {
      console.log('No se encontró un ID válido para eliminar la noticia.');
    }
  }  
}