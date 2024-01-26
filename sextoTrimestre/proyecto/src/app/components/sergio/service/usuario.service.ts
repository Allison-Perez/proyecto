import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/usuarios`);
  }

  updateUsuarioByEmail(email: string, updatedUser: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/modificar-usuarios`, { email, updatedUser });
  }



}
