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
  private _userRole: number = 0;

  constructor(private http: HttpClient) { }

  // Método para realizar la autenticación
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  // Método para obtener el rol del usuario
  getUserRole(): number {
    return this._userRole;
  }

  // Método para establecer el estado de autenticación y el rol
  setAuthenticationStatus(status: boolean, role: number): void {
    this._isAuthenticated = status;
    this._userRole = role;
  }

  // Otros métodos relacionados con la autenticación pueden ir aquí
}
