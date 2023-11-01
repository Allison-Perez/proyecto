import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators for form validation
import { ServiceService } from '../service/servicie.katalina.service';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
<<<<<<< HEAD
  styleUrls: ['./edit-perfil.component.css'],
=======
  styleUrls: ['./edit-perfil.component.scss']
>>>>>>> c827ba85151be2a4b9401e677fe27438717865ed
})
export class EditPerfilComponent implements OnInit {
  form: FormGroup;
  userData: any;

  constructor(private fb: FormBuilder, private service: ServiceService) {
    this.form = this.fb.group({
      primerNombre: ['', Validators.required], // Apply validation as needed
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: [{ value: '', disabled: true }, Validators.required], // Disable email input
    });
  }

  ngOnInit() {
    const correo: any = localStorage.getItem('user_email');
    if (correo) {
      this.service.getUserInfoByEmail(correo).subscribe(
        (data) => {
          this.userData = data;
          this.form.patchValue(data);
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    } else {
      console.error('El correo no está disponible');
    }
  }

  guardarCambios() {
    if (this.form.valid) {
      const userData = this.form.getRawValue(); // Get all form values
      const correo = userData.correo;

      this.service.updateUserInfoByEmail(correo, userData).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            alert('Los cambios se guardaron correctamente');
          } else {
            alert('Hubo un error al guardar los cambios');
          }
        },
        (error) => {
          console.error('Error saving changes:', error);
          alert('Hubo un error al guardar los cambios');
        }
      );
    } else {
      alert('Por favor, complete los campos requeridos.');
    }
  }
}
