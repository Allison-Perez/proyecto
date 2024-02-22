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

  getHorarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/horarios`);
  }

  crearHorario(formData: FormData, file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    formData.append('archivo', file); 
    
    return this.http.post<any>(`${this.apiUrl}/api/crearHorario`, formData, { headers });
  }

  editarHorario(idHorario: number, horarioData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/editarHorario/${idHorario}`, horarioData, { headers });
  }

  eliminarHorario(idHorario: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminarHorario/${idHorario}`);
  }
}
