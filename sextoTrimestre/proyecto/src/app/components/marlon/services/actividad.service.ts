import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../allison/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFichasUsuario(): Observable<any[]> {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    return this.http.get<any[]>(`${this.apiUrl}/fichasPorUsuario/${idUsuario}`);
  }

  getActivities(): Observable<any[]> {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    return this.http.get<any[]>(`${this.apiUrl}/listarActividades/${idUsuario}`);
  }

  createActivity(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/crearActividad`, formData, { headers });
  }

  updateActivity(idActividad: number, activityData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.put<any>(`${this.apiUrl}/editarActividad/${idActividad}`, activityData, { headers });
  }  

  deleteActivity(idActividad: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminarActividad/${idActividad}`);
  }
}
