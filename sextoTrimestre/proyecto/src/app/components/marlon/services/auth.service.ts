import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private userInfo: any = null; // Almacenará la información del usuario actual

  login() {
    // Implementa la lógica de inicio de sesión aquí y establece this.isAuthenticated en true si el inicio de sesión es exitoso.
    this.isAuthenticated = true;

    // Aquí iría la lógica para obtener la información del usuario después de iniciar sesión.
    // Supongamos que userInfo es un objeto que contiene información sobre el usuario, incluida su ficha.
    // Ejemplo:
    // this.userInfo = { email: 'usuario@ejemplo.com', fichaId: 1, ... };
  }

  logout() {
    // Implementa la lógica de cierre de sesión aquí y establece this.isAuthenticated en false.
    this.isAuthenticated = false;
    this.userInfo = null;

    // Elimina el correo electrónico del usuario del almacenamiento local al cerrar sesión.
    localStorage.removeItem('user_email');
  }
  
  // Método para obtener el correo electrónico del usuario
  getUserEmail() {
    return localStorage.getItem('user_email') || '';
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn() {
    return this.isAuthenticated;
  }

  // Método para obtener la información del usuario actual
  getUserInfo() {
    return this.userInfo;
  }

  constructor() { }
}
