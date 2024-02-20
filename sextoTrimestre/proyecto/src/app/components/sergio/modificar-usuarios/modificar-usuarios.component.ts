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
  originalUsuarios: any[] = [];
  private unsubscribe$ = new Subject<void>();
  editingUserId: number | null = null;
  editForm: FormGroup;
  filtroFicha: number | null = null;
  filtroNombre: string | null = null;
  filtroDocumento: number | null = null;
  listaFichas: number[] = [2558104, 1800002, 11231236, 2634256, 2789008];

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      documento: [''],
      primerNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      numeroFicha: [''],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
    });
  }

  aplicarFiltros() {
    let usuariosFiltrados = this.originalUsuarios.slice();

    // Convierte el filtroFicha a número o deja como null si no es un número
    const filtroFichaNumero = Number(this.filtroFicha) || null;
    console.log('Valor de filtroFichaNumero:', filtroFichaNumero);

    // Filtra la lista según los criterios de filtro
    usuariosFiltrados = usuariosFiltrados.filter((usuario) => {
      const cumpleFiltroFicha =
        filtroFichaNumero === null || usuario.numeroFicha === filtroFichaNumero;
      const cumpleFiltroNombre =
        !this.filtroNombre || usuario.primerNombre.includes(this.filtroNombre);
      const cumpleFiltroDocumento =
        !this.filtroDocumento || usuario.documento === this.filtroDocumento;

      return cumpleFiltroFicha && cumpleFiltroNombre && cumpleFiltroDocumento;
    });

    // Actualiza la lista de usuarios con la lista filtrada
    this.usuarios = usuariosFiltrados;

    console.log('Usuarios después de aplicar filtros:', this.usuarios);
  }

  limpiarFiltros() {
    // Restablecer la lista original y los valores de los filtros
    this.usuarios = this.originalUsuarios.slice();
    this.filtroFicha = null;
    this.filtroNombre = null;
    this.filtroDocumento = null;
  }

  ngOnInit(): void {
    this.usuarioService
      .getAllUsuarios()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.originalUsuarios = data.slice(); // Guardar la lista original
          this.usuarios = data;

          const miArreglo = data;
          miArreglo.map((usuario) => {
            usuario['editar'] = false;
          });

          this.usuarios = data;
          console.log(this.usuarios);
          this.aplicarFiltros();
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
    this.activateEditMode(this.usuarios[i].identificador);
    this.usuarios[i].editar = true;
    const user = this.usuarios[i];
  }

  getIdFicha(number_ficha: any) {
    const idFicha = this.listaFichas.indexOf(number_ficha) + 1;
    console.log(idFicha)
    return String(idFicha);
  }

  getIdRol(rolName: string) {
    let rolID = 2;
    if (rolName == 'Instructor') {
      rolID = 1;
    } else if (rolName == 'Administrador') {
      rolID = 3;
    }

    return String(rolID);
  }

  activateEditMode(userId: number) {
    // Copia los valores del usuario al formulario
    const userToEdit = this.usuarios.find((u) => u.identificador === userId);

    this.editForm.patchValue(userToEdit);

    // Actualiza la variable para mostrar el formulario
    this.editingUserId = userId;
  }

  saveChanges() {
    console.log('entra');

    if (this.editForm.valid) {
      const userEmail = this.editForm.value.correo;
      const editedUser = this.editForm.value;

      this.editForm.get('correo');

      console.log('Datos del usuario a enviar al servidor:', editedUser);

      this.usuarioService.updateUsuarioByEmail(userEmail, editedUser).subscribe(
        (response) => {
          console.log('Usuario actualizado correctamente:', response);
          this.ngOnInit();
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
