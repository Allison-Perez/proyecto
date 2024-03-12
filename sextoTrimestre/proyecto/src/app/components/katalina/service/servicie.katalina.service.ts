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
    getUserInfoByBlog(idBlog: number): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-blog-por-correo/${idBlog}`;
      console.log(idBlog);
      return this.http.get(url);
    }


    getBlogs(email: string): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-blog-por-correo/${email}`;
      console.log('URL para obtener blogs:', url);
      return this.http.get(url);
    }

  // VER GUIAS
  getUserInfoByguias(idguia: number): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-guias-por-correo/${idguia}`;
      console.log(idguia);
      return this.http.get(url);
    }

    getguias(email: string): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-guias-por-correo/${email}`;
      console.log('URL para obtener guias:', url);
      return this.http.get(url);
    }

  //VER HORARIOS
    getUserInfoByHorario(idHorario: number): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-horarios-por-id/${idHorario}`;
      console.log(idHorario);
      return this.http.get(url);
    }

    getHorarios(email: string): Observable<any> {
      const url = `${this.apiUrl}/api/obtener-horarios-por-correo/${email}`;
      console.log('URL para obtener horarios:', url);
      return this.http.get(url);
    }
  // VER ASISTENCIA 
    getDatosAsistencia(email: string): Observable<any> {
      const url = `/api/obtener-asistencia-por-correo/${email}`;
      console.log('URL para obtener datos de asistencia:', url);
      return this.http.get(url);
    }
    
  // CAMBIAR Y ACTUALIZAR CONTYRASEÑA
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

  getUserInfoByEmail(email: string): Observable<any> {
    const correoSinComillas = email.replace(/"/g, '');
    const url = `${this.apiUrl}/api/obtenerUsuario?correo=${correoSinComillas}`;
    return this.http.get(url);
  }

  updateUserInfoByEmail(email: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/api/actualizar-usuario?correo=${email}`;
    return this.http.post(url, userData);
  }



}