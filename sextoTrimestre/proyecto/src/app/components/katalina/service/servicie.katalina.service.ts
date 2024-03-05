import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private _userFichas: number[] = [];

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // VER BLOG
    getblogsFicha(idFicha: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/blogsFicha/${idFicha}`);
    }
 

  
  // Cambiar y Actualizar Contraseña
  cambiarContrasena(contrasenaAntigua: string, contrasenaNueva: string): Observable<any> {
    const endpoint = '/cambiar-contrasena';
    const url = `${this.apiUrl}${endpoint}`;
    const body = { contrasenaAntigua, contrasenaNueva };

    return this.http.post<any>(url, body);
  }

  updatePassword(email: string, passwordAnterior: string, passwordNueva: string): Observable<any> {
    const url = `${this.apiUrl}/api/cambiar-contrasena`;
    const userData = {
      correo: email.slice(1, -1),
      passwordAnterior: passwordAnterior,
      nuevaPassword: passwordNueva
    };

    console.log('Datos a enviar al servidor:', userData);

    return this.http.post(url, userData);
  }

  // Informacion Perfil
  getUserInfoByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/api/obtenerUsuario?correo=${email}`;

    return this.http.get(url);
  }

  updateUserInfoByEmail(email: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/api/actualizar-usuario?correo=${email}`;
    return this.http.post(url, userData);
  }
}
