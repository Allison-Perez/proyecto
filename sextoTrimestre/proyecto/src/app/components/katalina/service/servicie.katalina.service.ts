import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:3000';

    // VER ACTIVIDADES 
    getActivities(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/api/actividad/list`);
    }
      
    updateActivity(activityId: string, updatedData: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/update/${activityId}`, updatedData);
  }

   // VER ASISTENCIAS
  getAsistencia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/asistencia/list`);
  }
   // Actualizar una asistencia con archivo y comentario
   updateAsistencia(asistenciaId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${asistenciaId}`, updatedData);
  }

  // VER BLOG
  getNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/blog/list`);
  }

  updateNews(newsId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${newsId}`, updatedData);
  }

   // VER HORARIOS
  getHorario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/horario/list`);
  }
  updateHorario(horarioId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${horarioId}`, updatedData);
  }
  
  cambiarContrasena(contrasenaAntigua: string, contrasenaNueva: string): Observable<any> {
    const endpoint = '/cambiar-contrasena'; 
    const url = `${this.apiUrl}${endpoint}`;
    const body = { contrasenaAntigua, contrasenaNueva };

    return this.http.post<any>(url, body);
  }
  getUserInfoByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/api/obtenerUsuario?correo=${email}`;
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
  actualizarFotoPerfil(usuarioId: number, nuevaFotoUrl: string): Observable<any> {
    const url = `${this.apiUrl}/${usuarioId}/foto-perfil`;
    return this.http.put(url, { fotoPerfil: nuevaFotoUrl });
  }
}
