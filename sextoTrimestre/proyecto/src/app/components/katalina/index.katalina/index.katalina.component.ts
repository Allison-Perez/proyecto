import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index.katalina',
  templateUrl: './index.katalina.component.html',
  styleUrls: ['./index.katalina.component.scss']
})
export class IndexKatalinaComponent {
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private authService: AuthService, private router: Router,) {
    // Constructor correctamente estructurado
  }

  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleProfileMenu() {
    console.log(this.mostrarMenuPerfil);

    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }
 redirectTo(route: string) {
    this.router.navigate([route]);
    // Cierra el menú después de redirigir
    this.mostrarMenuPerfil = false;
  }
  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
}
