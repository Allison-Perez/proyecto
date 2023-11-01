import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private apiUrl = 'http://localhost:3000/api/horario';

  constructor(private http: HttpClient) {}

  // Obtener lista de asistencia
  getHorario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  // Subir una asistencia con archivo y comentario
  createHorario(horarioData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, horarioData);
  }

  // Actualizar una asistencia con archivo y comentario
  updateHorario(horarioId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${horarioId}`, updatedData);
  }

  // Eliminar una asistencia por ID
  deleteHorario(horarioId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${horarioId}`);
  }
}
