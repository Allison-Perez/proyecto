import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  perfilForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      foto: ['', Validators.required],
      numero_ficha: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]],
      trimestre: ['', Validators.required],
    });
  }

  guardarPerfil() {
    if (this.perfilForm.valid) {
      console.log("Formulario válido", this.perfilForm.value);
      // Realizar operaciones aquí
    } else {
      console.log("Formulario inválido");
    }
  }


}
