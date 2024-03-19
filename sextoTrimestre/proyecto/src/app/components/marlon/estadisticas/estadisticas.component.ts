import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../allison/service/auth.service';
import { EstadisticasService } from '../services/estadisticas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent {
  isMenuOpen: boolean = false;
  mostrarMenuPerfil: boolean = false;

  constructor(private estadisticasService: EstadisticasService, private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
