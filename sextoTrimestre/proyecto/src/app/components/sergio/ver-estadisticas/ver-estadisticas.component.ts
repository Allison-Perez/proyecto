import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-estadisticas',
  templateUrl: './ver-estadisticas.component.html',
  styleUrls: ['./ver-estadisticas.component.scss']
})
export class VerEstadisticasComponent {

  constructor(private authService: AuthService, private router: Router,) {
    // Constructor correctamente estructurado
  }
  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }

}
