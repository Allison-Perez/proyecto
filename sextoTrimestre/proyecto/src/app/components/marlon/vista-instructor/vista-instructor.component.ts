import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ServiceService } from '../services/perfil.service';
import { Router } from '@angular/router';
import { AuthService } from '../../allison/service/auth.service';

@Component({
  selector: 'app-vista-instructor',
  templateUrl: './vista-instructor.component.html',
  styleUrls: ['./vista-instructor.component.css']
})
export class VistaInstructorComponent implements OnInit {
  @ViewChild('optionsDropdown') optionsDropdown!: ElementRef;
  userData: any;
  isMenuOpen: boolean = false;

  constructor(
    private service: ServiceService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userData = {
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      ficha: '',
      correo: '',
    };
  }
  toggleMenu() {
    console.log('Función toggleMenu() llamada.');
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    const userEmail: string | null = this.authService.getUserEmail();
  
    if (userEmail) {
      this.service.getUserInfoByEmail(userEmail).subscribe(data => {
        this.userData = data;
      });
    } else {
      console.error('No se pudo obtener el correo del usuario.');
    }
  }
  

  toggleDropdown() {
    const dropdownMenu = this.optionsDropdown.nativeElement.nextElementSibling;
    dropdownMenu.classList.toggle('show');
  }

  editarInformacion() {
    this.router.navigate(['/editar-perfil']);
  }

  editarPassword() {
    this.router.navigate(['/update-password']);
  }

  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
}
