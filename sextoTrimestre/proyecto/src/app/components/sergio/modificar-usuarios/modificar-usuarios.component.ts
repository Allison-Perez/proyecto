// Importaciones necesarias
import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-modificar-usuarios',
  templateUrl: './modificar-usuarios.component.html',
  styleUrls: ['./modificar-usuarios.component.css'],
})
export class ModificarUsuariosComponent implements OnInit {
  //
  // Declaración del formulario
  searchForm: FormGroup;
  usuarios = [{ primer_nombre: '', primer_apellido: '' }];

  // Constructor con inyección de dependencias
  constructor(private userService: UserService, private fb: FormBuilder) {
    // Inicialización del formulario
    this.searchForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }

  // Método ngOnInit para inicialización de componentes
  ngOnInit(): void {
    // Lógica que se ejecuta al iniciar el componente

    // Ejemplo: Obtener lista de usuarios al iniciar el componente
    this.userService.getUsers().subscribe((data) => {
      // Manejar la respuesta
      console.log(data);
    });
  }

  // Método para buscar usuario
  searchUsuario(): void {
    // Ejemplo: Buscar usuario según tipoDocumento e idUsuario
  }

  // Otras funciones y lógica del componente
}
