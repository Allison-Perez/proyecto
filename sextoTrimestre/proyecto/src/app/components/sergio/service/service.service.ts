import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:3000';

  getUserInfoByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/api/obtener-usuario?correo=${email}`;
    return this.http.get(url);
  }

  updateUserInfoByEmail(email: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/api/actualizar-usuario?correo=${email}`;
    return this.http.post(url, userData);
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

  registro(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  getStaticsInstructores(): Observable<any[]> {
    const url = `${this.apiUrl}/api/staticsInstructores`;
    return this.http.get<any[]>(url);
  }


}
