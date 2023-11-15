import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  // Buscar usuario por tipo de documento e ID
  searchUser(tipoDocumento: number, idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/search`, {
      params: {
        tipoDocumento: tipoDocumento.toString(),
        idUsuario: idUsuario.toString()
      }
    });
  }

  // Actualizar usuario
  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${userId}`, userData);
  }

  // Otros métodos relacionados con usuarios pueden ir aquí
}
