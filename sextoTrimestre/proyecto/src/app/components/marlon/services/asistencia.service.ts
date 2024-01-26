import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:3000/api/asistencia';

  constructor(private http: HttpClient) {}

  // Obtener lista de asistencia
  getAsistencia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  // Subir una asistencia con archivo y comentario
  createAsistencia(asistenciaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, asistenciaData);
  }

  // Actualizar una asistencia con archivo y comentario
  updateAsistencia(asistenciaId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${asistenciaId}`, updatedData);
  }

  // Eliminar una asistencia por ID
  deleteAsistencia(asistenciaId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${asistenciaId}`);
  }
}
