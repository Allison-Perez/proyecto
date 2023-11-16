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

  updateUsuario(userId: number, updatedUser: any): Observable<any> {
    // Asegúrate de tener la ruta correcta para actualizar un usuario en tu backend
    const url = `${this.apiUrl}/api/usuarios/${userId}`;

    // Realiza la solicitud de actualización al backend
    return this.http.put(url, updatedUser);
  }

}
