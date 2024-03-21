// blog.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../allison/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  crearBlog(blogData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/crearBlog`, blogData, { headers });
  }

  getFichasUsuario(): Observable<any[]> {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    return this.http.get<any[]>(`${this.apiUrl}/fichasPorUsuario/${idUsuario}`);
  }

  getBlogsPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blogsPorUsuario/${idUsuario}`);
  }

  editarBlog(idBlog: number, blogData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/editarBlog/${idBlog}`, blogData, { headers });
  }

  eliminarBlog(idBlog: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminarBlog/${idBlog}`);
  }
}
