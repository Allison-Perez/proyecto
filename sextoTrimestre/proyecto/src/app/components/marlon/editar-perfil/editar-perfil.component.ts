import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditarPerfilService } from '../services/editar-perfil.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})

export class EditarPerfilComponent implements OnInit {
  form: FormGroup;
  userData: any;

  constructor(private fb: FormBuilder, private service: EditarPerfilService, private router: Router, private authService: AuthService) {
      this.form = this.fb.group({
        primerNombre: ['', Validators.required],
        segundoNombre: [''],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        correo: [''],
        fechaIngreso: ['', [Validators.required, this.fechaInferiorHoyValidator]],
        celular : ['', Validators.required],
        informacionAcademica:[''],
        informacionAdicional :[''],
      });
    }

    fechaInferiorHoyValidator(control: AbstractControl): { [key: string]: boolean } | null {
      const selectedDate = new Date(control.value);
      const hoy = new Date();

      if (selectedDate > hoy) {
        return { 'fechaInferiorHoy': true };
      }

      return null;
    }

  ngOnInit() {
    console.log("correo del individuo");
    let correo:any = localStorage.getItem('user_email');
    correo = correo.replace(/^"(.*)"$/, '$1');
    console.log(correo);



    if (correo) {
      this.service.getUserInfoByEmail(correo).subscribe(data => {
        this.userData = data;
        this.form.patchValue(data);
        console.log(data);

      });
    } else {
      console.error('El correo no está disponible');
    }
  }


  guardarCambios() {

    if (this.form.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const correo = this.form.value.correo;
    const userData = this.form.value;

    this.service.updateUserInfoByEmail(correo, userData).subscribe(response => {
      // Maneja la respuesta de la actualización
      if (response.status === 200 || 204) {
        alert('Los cambios se guardaron correctamente');

        setTimeout(() => {
          this.router.navigate(['/perfil']);
        }, 1000);

      } else {
        alert('Hubo un error al guardar los cambios');
      }
    });
  }

  logout() {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión o a donde desees después del cierre de sesión.
    // Por ejemplo, puedes usar el enrutador para redirigir al componente de inicio de sesión.
    this.router.navigate(['/login']);
  }
}
