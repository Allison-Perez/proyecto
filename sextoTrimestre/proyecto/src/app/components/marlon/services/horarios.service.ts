import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../allison/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFichasUsuario(): Observable<any[]> {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    return this.http.get<any[]>(`${this.apiUrl}/fichasPorUsuario/${idUsuario}`);
  }

  getHorarios(): Observable<any> {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    return this.http.get(`${this.apiUrl}/obtenerHorarios/${idUsuario}`);
  }

  crearHorario(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/crearHorario`, formData, { headers });
  }

  editarHorario(idHorario: number, horarioData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/editarHorario/${idHorario}`, horarioData, { headers });
  }

  eliminarHorario(idHorario: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminarHorario/${idHorario}`);
  }
}
