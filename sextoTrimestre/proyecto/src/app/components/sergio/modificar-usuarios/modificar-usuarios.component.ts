import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modificar-usuarios',
  templateUrl: './modificar-usuarios.component.html',
  styleUrls: ['./modificar-usuarios.component.scss'],
})
export class ModificarUsuariosComponent implements OnInit, OnDestroy {
  usuarios: any[]  = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.usuarios = data;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editUser(usuario: any) {
    // Aquí puedes abrir un modal, redirigir a una página de edición, etc.
    // Puedes usar Angular services para manejar la lógica de edición.
    console.log('Editando usuario:', usuario);
  }
}
