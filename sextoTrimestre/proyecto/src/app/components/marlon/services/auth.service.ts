import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private userInfo: any = null; // Almacenará la información del usuario actual

  login(userInfo: any) {
    // Implementa la lógica de inicio de sesión aquí y establece this.isAuthenticated en true si el inicio de sesión es exitoso.
    this.isAuthenticated = true;

    // Almacena la información del usuario
    this.userInfo = userInfo;

    // Almacena el correo electrónico del usuario en el almacenamiento local
    localStorage.setItem('user_email', userInfo.email);
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
