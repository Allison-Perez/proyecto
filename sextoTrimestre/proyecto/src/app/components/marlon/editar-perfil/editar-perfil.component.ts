import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditarPerfilService } from '../services/editar-perfil.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})

export class EditarPerfilComponent implements OnInit {
  form: FormGroup;
  userData: any;

  constructor(private fb: FormBuilder, private service: EditarPerfilService) {
    this.form = this.fb.group({
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      correo: ['']
    });
  }

  ngOnInit() {
    const correo: any = localStorage.getItem('user_email');
    if (correo) {
      this.service.getUserInfoByEmail(correo).subscribe(data => {
        this.userData = data;
        this.form.patchValue(data); 
      });
    }else{
      console.error('El correo no está disponible');
    }
  }

  guardarCambios(){
    const correo = this.form.value.correo;
    const userData = this.form.value;

    this.service.updateUserInfoByEmail(correo, userData).subscribe(response => {
      if (response.status === 200 || response.status === 204) {
        alert('Los cambios se guardaron correctamente');
      } else {
        alert('Hubo un error al guardar los cambios');
      }
    });
  }
}