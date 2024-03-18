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
    const url = `${this.apiUrl}/api/obtenerInstructor?correo=${email}`;
    return this.http.get(url);
  }

  updateUserInfoByEmail(email: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/api/actualizarInstructor?correo=${email}`;
    console.log('URL de actualización:', url);
    console.log('Datos a enviar al servidor:', userData);
    return this.http.put(url, userData);
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

updateProfilePicture(email: string, imageFile: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('imagen', imageFile);

  return this.http.post<any>(`${this.apiUrl}/api/cambiar-foto?correo=${encodeURIComponent(email)}`, formData);
}
}
