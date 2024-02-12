import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getBlogsPorFicha() {
    const userInfo = this.authService.getUserInfo();
    const fichaId = userInfo ? userInfo.fichaId : null;

    if (fichaId) {
      return this.httpClient.get<any[]>(`http://localhost:3000/blogsPorFicha/${fichaId}`);
    } else {
      return null;
    }
  }

  crearBlog(blog: any) {
    return this.httpClient.post('http://localhost:3000/crearBlog', blog);
  }

  editarBlog(blogId: number, blog: any) {
    return this.httpClient.put(`http://localhost:3000/editarBlog/${blogId}`, blog);
  }

  eliminarBlog(blogId: number) {
    return this.httpClient.delete(`http://localhost:3000/eliminarBlog/${blogId}`);
  }
}
