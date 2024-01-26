import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;

  login() {
    // Implementa la lógica de inicio de sesión aquí y establece this.isAuthenticated en true si el inicio de sesión es exitoso.
    this.isAuthenticated = true;
  }

  logout() {
    // Implementa la lógica de cierre de sesión aquí y establece this.isAuthenticated en false.
    this.isAuthenticated = false;

    // Elimina el correo electrónico del usuario del almacenamiento local al cerrar sesión.
    localStorage.removeItem('user_email');
  }
  
  getUserEmail() {
    return localStorage.getItem('user_email') || '';
  }
  isLoggedIn() {
    return this.isAuthenticated;
  }

  constructor() { }
}