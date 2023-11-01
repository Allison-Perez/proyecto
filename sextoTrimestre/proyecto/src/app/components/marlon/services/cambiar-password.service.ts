import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambiarPasswordService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  cambiarContrasena(contrasenaAntigua: string, contrasenaNueva: string): Observable<any> {
    const endpoint = '/cambiar-contrasena'; 
    const url = `${this.apiUrl}${endpoint}`;
    const body = { contrasenaAntigua, contrasenaNueva };

    return this.http.post<any>(url, body);
  }
}
