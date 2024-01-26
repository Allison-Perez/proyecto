// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ServiceService } from '../service/service.service';

// @Component({
//   selector: 'app-recuperar',
//   templateUrl: './recuperar.component.html',
//   styleUrls: ['./recuperar.component.scss'],
// })
// export class RecuperarComponent implements OnInit {
//   recuperarForm: FormGroup;
//   showError: boolean = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private http: ServiceService,
//     private router: Router
//   ) {
//     this.recuperarForm = this.formBuilder.group({
//       correo: ['', [Validators.required, Validators.email]],
//     });
//   }

//   ngOnInit(): void {}

//   onRecuperarSubmit() {
//     if (this.recuperarForm.valid) {
//       const formData = this.recuperarForm.value;

//       this.http.recuperar(formData).subscribe(
//         (response: any) => {
//           if (
//             response &&
//             response.message === 'Correo de recuperación enviado'
//           ) {
//             this.router.navigate(['/validacion']);
//           }
//         },
//         (error: any) => {
//           if (error.status === 404) {
//             this.showError = true;
//           }
//         }
//       );
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss'],
})
export class RecuperarComponent implements OnInit {
  recuperarForm: FormGroup;
  showError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: ServiceService,
    private router: Router
  ) {
    this.recuperarForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onRecuperarSubmit() {
    if (this.recuperarForm.valid) {
      const formData = this.recuperarForm.value;
      const correo = formData.correo; // Obtén el valor del correo del formulario

      this.http.recuperar(formData).subscribe(
        (response: any) => {
          if (
            response &&
            response.message === 'Correo de recuperación enviado'
          ) {
            // Redirige a la página de validación y pasa el valor del correo como parámetro
            this.router.navigate(['/validacion', correo]);
          }
        },
        (error: any) => {
          if (error.status === 404) {
            this.showError = true;
          }
        }
      );
    }
  }
}
