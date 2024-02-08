import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  apiUrl = 'http://localhost:3000'

  login(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, data)
  }

  registro(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  recuperar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, data);
  }

  getPreguntaSeguridad(correo: string) {
    return this.http.get(`${this.apiUrl}/api/preguntaSeguridad/${correo}`);
  }

  verificarRespuesta(correo: string, respuesta: string) {
    // Realiza una solicitud POST para verificar la respuesta
    return this.http.post(`${this.apiUrl}/api/verificarRespuesta`, { correo, respuesta });
  }

}
