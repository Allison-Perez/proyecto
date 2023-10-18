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
    this.editingNews = { ...news }; 
  }

  cancelEdit() {
    this.editingNews = null;
  }

  updateNews() {
    this.blogService.updateNews(this.editingNews.id, this.editingNews).subscribe(() => {
      this.loadNews();
      this.editingNews = null;
    });
  }

  deleteNews(newsId: number) {
    const newsIdStr = newsId.toString();
    this.blogService.deleteNews(newsIdStr).subscribe(() => {
      this.loadNews();
    });
  }
}
