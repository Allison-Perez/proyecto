import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../allison/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Obtener lista de asistencia filtrada por fecha, ID de usuario y ID de ficha
  getAsistencia(fecha: string, idUsuario: number, idFicha: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar?fecha=${fecha}&idUsuario=${idUsuario}&idFicha=${idFicha}`);
  }

  // Editar una asistencia por su ID
  editarAsistencia(asistenciaId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editarAsistencia/${asistenciaId}`, updatedData);
  }

  // Verificar si existe asistencia para la fecha y ficha seleccionadas
  verificarAsistencia(fecha: string, idFicha: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificarAsistencia?fecha=${fecha}&idFicha=${idFicha}`);
  }

  // Crear una nueva entrada en la tabla asistencia si no existe
  crearAsistencia(fecha: string, idFicha: number, idUsuario: number, idInstructor: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/crearOActualizarAsistencia`, { fecha, idFicha, idUsuario, idInstructor });
  }

  // Obtener fichas asociadas al usuario actual
  getFichasUsuario(): Observable<any[]> {
    const idUsuario = this.authService.getUserInfo().idUsuario;
    return this.http.get<any[]>(`${this.apiUrl}/fichasPorUsuario/${idUsuario}`);
  }
}
