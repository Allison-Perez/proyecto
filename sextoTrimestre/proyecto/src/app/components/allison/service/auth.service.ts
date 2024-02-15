import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';
  private _isAuthenticated = false;
  private _userRole: number = 0;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

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

  // Método para obtener el ID del usuario actual
  getIdUsuarioActual(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.idUsuario;
    }
    return null;
  }

  // Método para obtener la información del usuario
  getUserInfo(): any {
    return {};
  }
}
