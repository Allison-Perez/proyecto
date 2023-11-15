import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Verificar si el usuario está autenticado utilizando tu servicio de autenticación
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Si el usuario no está autenticado, redirige al componente de inicio de sesión
      this.router.navigate(['/login']);  // Ajusta la ruta según tus necesidades
      return false;
    }
  }
}
