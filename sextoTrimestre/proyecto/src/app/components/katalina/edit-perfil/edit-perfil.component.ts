import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.css']
})
export class EditPerfilComponent implements OnInit {
  form: FormGroup;
  userData: any;

  constructor(private fb: FormBuilder, private service: ServiceService) {
    this.form = this.fb.group({
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      correo: ['']
    });
  }

  ngOnInit() {
    // Obtén el correo del usuario, por ejemplo, desde la sesión o almacenamiento local
    let correo:any = localStorage.getItem('user_email');
    correo = correo.replace(/^"(.*)"$/, '$1');

    if (correo) {
      // Llama a tu servicio para obtener la información del usuario por correo
      this.service.getUserInfoByEmail(correo).subscribe(data => {
        this.userData = data;
        this.form.patchValue(data); // Llena el formulario con los datos del usuario
      });
    } else {
      // Maneja el caso en el que el correo no esté disponible, por ejemplo, redirigiendo o mostrando un mensaje de error.
      console.error('El correo no está disponible');
    }
  }


  guardarCambios() {
    const correo = this.form.value.correo;
    const userData = this.form.value;

    this.service.updateUserInfoByEmail(correo, userData).subscribe(response => {
      // Maneja la respuesta de la actualización
      if (response.status === 200 || 204) {
        alert('Los cambios se guardaron correctamente');
      } else {
        alert('Hubo un error al guardar los cambios');
      }
    });
  }
}