import { Component } from '@angular/core';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-ver-blog',
  templateUrl: './ver-blog.component.html',
  styleUrls: ['./ver-blog.component.scss']
})
export class VerBlogComponent {
  newsList: any[] = [];
  newBlog: any = { titulo: '', comentario: '', imagenOpcional: null };
  imageFile: File | null = null;
  isMenuOpen: boolean = false;
  
  constructor(private ServiceService: ServiceService) { }

  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }  
  
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
    const idFicha = 1; 
    this.ServiceService.getBlogsPorFicha(idFicha).subscribe(
      data => {
        this.newsList = data;
      },
      error => {
        console.error('Error al cargar los blogs:', error);
      }
    );
  }
 

}
