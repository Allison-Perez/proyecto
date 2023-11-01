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

    // VER ACTIVIDADES 
    getActivities(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/list`);
    }
      
    updateActivity(activityId: string, updatedData: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/update/${activityId}`, updatedData);
  }

   // VER ASISTENCIAS
  getAsistencia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }
   // Actualizar una asistencia con archivo y comentario
   updateAsistencia(asistenciaId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${asistenciaId}`, updatedData);
  }

  // VER BLOG
  getNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  updateNews(newsId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${newsId}`, updatedData);
  }

   // VER HORARIOS
  getHorario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
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

}
