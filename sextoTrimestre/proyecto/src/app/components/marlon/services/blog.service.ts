import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = 'http://localhost:3000/api/blog';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  createNews(newsData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, newsData);
  }

  updateNews(newsId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${newsId}`, updatedData);
  }

  deleteNews(newsId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${newsId}`);
  }
}