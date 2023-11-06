import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-ver-blog',
  templateUrl: './ver-blog.component.html',
  styleUrls: ['./ver-blog.component.scss']
})
export class VerBlogComponent {

  constructor(private ServiceService: ServiceService) { }

  newsList: any[] = [];
  newNews: any = { titulo: '', contenido: '' };
  editingNews: any | null = null;

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.ServiceService.getNews().subscribe(data => {
      console.log('Datos de noticias:', data);
      if (data.length > 0) {
        console.log('Primer objeto:', data[0]);
      }
  
      this.newsList = data;
    });
  }
  updateNews() {
    this.ServiceService.updateNews(this.editingNews.id_noticias, this.editingNews).subscribe(() => {
      this.loadNews();
      this.editingNews = null;
    });
  }

}
