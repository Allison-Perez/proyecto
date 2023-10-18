import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/api/actividad';

  constructor(private http: HttpClient) {}

  // Obtener lista de actividades
  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  // Subir una actividad con archivo y comentario
  createActivity(activityData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, activityData);
  }

  // Actualizar una actividad con archivo y comentario
  updateActivity(activityId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${activityId}`, updatedData);
  }

  // Eliminar una actividad por ID
  deleteActivity(activityId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${activityId}`);
  }
}
