// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';
  private _isAuthenticated = false;

  constructor(private http: HttpClient) { }

  // Método para realizar la autenticación
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  // Método para establecer el estado de autenticación
  setAuthenticationStatus(status: boolean): void {
    this._isAuthenticated = status;
  }

  // Otros métodos relacionados con la autenticación pueden ir aquí
}
