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
      documento: [''],
      primerNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      numeroFicha: [''],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]]
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

  editUser(i: number) {
    // Puedes abrir un modal aquí o realizar otras acciones antes de activar el modo de edición
    this.activateEditMode(this.usuarios[i].id_usuario);
    this.usuarios[i].editar = true;
    // const user = this.usuarios[i];
  }

  activateEditMode(userId: number) {
    // Copia los valores del usuario al formulario
    const userToEdit = this.usuarios.find((u) => u.id_usuario === userId);
    this.editForm.patchValue(userToEdit);

    // Actualiza la variable para mostrar el formulario
    this.editingUserId = userId;
  }


  saveChanges() {
    console.log('entra');

    if (this.editForm.valid) {
      const userEmail = this.editForm.value.correo;
      const editedUser = this.editForm.value;

      this.editForm.get('correo')

      console.log('Datos del usuario a enviar al servidor:', editedUser);

      this.usuarioService.updateUsuarioByEmail(userEmail, editedUser).subscribe(
        (response) => {
          console.log('Usuario actualizado correctamente:', response);
          this.ngOnInit()
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          // Error interno en el servidor (500)
        }
      );

      this.editingUserId = null;
    }
  }


  cancelEdit(i: number) {
    this.activateEditMode(this.usuarios[i].id_usuario);
    this.usuarios[i].editar = false;
  }
}
