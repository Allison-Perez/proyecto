import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private _userFichas: number[] = [];
  private idFicha!: number; 

  constructor(private jwtHelper: JwtHelperService) { }

  login(userEmail: string) { // Añade userEmail como parámetro
    // Implementa la lógica de inicio de sesión aquí y establece this.isAuthenticated en true si el inicio de sesión es exitoso.
    this.isAuthenticated = true;

    // Guarda el correo electrónico del usuario en el localStorage al iniciar sesión
    localStorage.setItem('user_email', userEmail);
  }

  logout() {
    // Implementa la lógica de cierre de sesión aquí y establece this.isAuthenticated en false.

    // Elimina el correo electrónico del usuario del almacenamiento local al cerrar sesión.
    localStorage.removeItem('user_email');
    this.isAuthenticated = false;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getUserEmail() {
    return localStorage.getItem('user_email') || '';
  }
 getUserFichas(): number[] {
    return this._userFichas;
  }
  // setIdFicha(idFicha: number): void {
  //   this.idFicha = idFicha;
  // }

  // getIdFicha(): number {
  //   return this.idFicha;
  // }
}
