import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-ver-blog',
  templateUrl: './ver-blog.component.html',
  styleUrls: ['./ver-blog.component.css']
})
export class VerBlogComponent {
  newsList: any[] = [];
  newNews: any = { titulo: '', contenido: '' };
  editingNews: any | null = null;

  constructor(private ServiceService: ServiceService) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.ServiceService.getNews().subscribe(data => {
      this.newsList = data;
    });
  }

  updateNews() {
    this.ServiceService.updateNews(this.editingNews.id, this.editingNews).subscribe(() => {
      this.loadNews();
      this.editingNews = null;
    });
  }

}
