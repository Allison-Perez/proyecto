import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ServiceService } from '../services/perfil.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-vista-instructor',
  templateUrl: './vista-instructor.component.html',
  styleUrls: ['./vista-instructor.component.css']
})
export class VistaInstructorComponent implements OnInit {
  @ViewChild('optionsDropdown') optionsDropdown!: ElementRef;
  userData: any;

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

  ngOnInit() {
    // Debes obtener el correo del usuario de alguna manera, por ejemplo, desde un servicio de autenticación
    const correo: string | null = localStorage.getItem('user_email');

    if (correo) {
      // Llama al servicio para obtener la información del usuario
      this.service.getUserInfoByEmail(correo).subscribe(data => {
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
