import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../allison/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError('nou nou');
  }

  obtenerEstadisticas(): Observable<any> {
    const idUsuario = this.authService.getIdUsuarioActual();
    console.log('ID de Usuario Actual:', idUsuario);
    return this.http.get<any>(`${this.baseUrl}/estadisticasPorFichas/${idUsuario}`).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }

  getBlogsPorInstructor(): Observable<any> {
    const idUsuario = this.authService.getIdUsuarioActual();
    console.log('ID de Usuario Actual:', idUsuario);
    return this.http.get<any>(`${this.baseUrl}/blogs/${idUsuario}`);
  }

  getGuiasPorInstructor(): Observable<any> {
    const idUsuario = this.authService.getIdUsuarioActual();
    console.log('ID de Usuario Actual:', idUsuario);
    return this.http.get<any>(`${this.baseUrl}/guias/${idUsuario}`);
  }

  getHorarios(): Observable<any> {
    const idUsuario = this.authService.getIdUsuarioActual();
    console.log('ID de Usuario Actual:', idUsuario);
    return this.http.get<any>(`${this.baseUrl}/horarios/${idUsuario}`);
  }

  getAsistencias(): Observable<any> {
    const idUsuario = this.authService.getIdUsuarioActual();
    console.log('ID de Usuario Actual:', idUsuario);
    return this.http.get<any>(`${this.baseUrl}/asistencias/${idUsuario}`);
  }

  obtenerFichasPorInstructor(): Observable<any> {
    const idUsuario = this.authService.getIdUsuarioActual();
    console.log('ID de Usuario Actual:', idUsuario);
    return this.http.get<any>(`${this.baseUrl}/fichasPorInstructor/${idUsuario}`);
  }

  obtenerEstadisticasPorFicha(numeroFicha: string): Observable<any> {
    console.log('Número de Ficha:', numeroFicha);
    return this.http.get<any>(`${this.baseUrl}/estadisticasPorFichas/${numeroFicha}`).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }
}
