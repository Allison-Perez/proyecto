import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiUrl = '/api/app'; 

  constructor(private http: HttpClient) {}

  getPerfiles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  postPerfil(perfilData: any): Observable<any> {
    return this.http.post(this.apiUrl, perfilData);
  }
}
