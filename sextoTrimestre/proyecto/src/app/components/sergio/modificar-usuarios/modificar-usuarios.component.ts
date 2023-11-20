import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modificar-usuarios',
  templateUrl: './modificar-usuarios.component.html',
  styleUrls: ['./modificar-usuarios.component.scss'],
})
export class ModificarUsuariosComponent implements OnInit, OnDestroy {
  usuarios: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private ServiceService: ServiceService, private router: Router ) { }

  ngOnInit(): void {
    this.ServiceService.getAllUsuarios()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log('Datos del servidor:', data);
        this.usuarios = data;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editarUsuario(correo: string): void {
    this.router.navigate(['/modificar-info', correo]);
  }
}
