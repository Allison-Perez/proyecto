import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modificar-usuarios',
  templateUrl: './modificar-usuarios.component.html',
  styleUrls: ['./modificar-usuarios.component.scss'],
})
export class ModificarUsuariosComponent implements OnInit, OnDestroy {
  usuarios: any[] = [];
  private unsubscribe$ = new Subject<void>();
  editingUserId: number | null = null;
  editForm: FormGroup;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      id_usuario: [''],
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      fecha_nacimiento: [''],
      ficha: [''],
      correo: ['', [Validators.required, Validators.email]],
    });
  }



  ngOnInit(): void {
    this.usuarioService
      .getAllUsuarios()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          const miArreglo = data
          miArreglo.map((usuario) => {
            usuario['editar'] = false
          })

          this.usuarios = data;
          console.log(this.usuarios);
        },
        (error) => {
          console.error('Error al cargar usuarios:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editUser(usuario: any) {
    // Puedes abrir un modal aquí o realizar otras acciones antes de activar el modo de edición
    this.activateEditMode(usuario.id_usuario);
    this.usuarios[usuario].editar = true
    // const user = this.usuarios[usuario]

  }

  activateEditMode(userId: number) {
    // Copia los valores del usuario al formulario
    const userToEdit = this.usuarios.find((u) => u.id_usuario === userId);
    this.editForm.patchValue(userToEdit);

    // Actualiza la variable para mostrar el formulario
    this.editingUserId = userId;
  }

  submitEditForm() {
    if (this.editForm.valid) {
      // Puedes realizar acciones necesarias antes de enviar el formulario, si es necesario
      // Aquí puedes enviar el formulario a tu servicio para que haga la actualización en tu backend
      const userId = this.editForm.value.id_usuario;
      const editedUser = this.editForm.value;

      // Llama al método del servicio para actualizar el usuario
      this.usuarioService.updateUsuario(userId, editedUser).subscribe(
        (response) => {
          console.log('Usuario actualizado correctamente:', response);
          // Puedes realizar acciones adicionales después de la actualización, si es necesario
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          // Puedes manejar el error aquí, si es necesario
        }
      );

      // Desactiva el modo edición
      this.editingUserId = null;
    }
  }
}
