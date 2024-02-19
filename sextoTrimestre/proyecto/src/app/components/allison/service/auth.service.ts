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

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  
  login(data: any): Observable<any> {
  localStorage.setItem('token', data.token);

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

  setAuthenticationStatus(status: boolean, role: number, fichas: number[]): void {
    this._isAuthenticated = status;
    this._userRole = role;
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
    console.log('Token en getUserInfo:', token);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded Token:', decodedToken);
      return {
        idUsuario: decodedToken.idUsuario,
        idFicha: decodedToken.idFicha
      };
    }
    return null;
  }
  
}
