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
  private _userFichas: number[] = [];
  private _userInfo: any = {};
  private isAuthenticatedd: boolean = false;
  private userInfo: any = null;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  getUserRole(): number {
    return this._userRole;
  }

  getUserFichas(): number[] {
    return this._userFichas;
  }

  setAuthenticationStatus(status: boolean, role: number, fichas: number[], userInfo: any): void {
    this._isAuthenticated = status;
    this._userRole = role;
    this._userInfo = userInfo;
    this._userFichas = fichas;
  }

  getIdUsuarioActual(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.idUsuario;
    }
    return null;
  }

  getUserInfo(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return {
          idUsuario: decodedToken.idUsuario,
          idFicha: decodedToken.idFicha
        };
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    } else {
      console.error('Token no encontrado en el almacenamiento local');
      return null;
    }
  }
  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.correo; // Suponiendo que el correo electrónico está almacenado en el token
    }
    return null;
  }
  
  
  logout() {
    localStorage.removeItem('token');
    // Implementa la lógica de cierre de sesión aquí y establece this.isAuthenticated en false.
    this.isAuthenticatedd = false;
    this.userInfo = null;

    // Elimina el correo electrónico del usuario del almacenamiento local al cerrar sesión.
    localStorage.removeItem('user_email');
  }
}
