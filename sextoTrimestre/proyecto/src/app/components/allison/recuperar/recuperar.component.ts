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
      const correo = formData.correo;

      console.log(correo);

      this.http.recuperar(formData).subscribe(
        (response: any) => {
          console.log("Respuesta del servicio:", response);

          if (response && response.message === 'El correo se encuentra registrado en la base de datos') {
            console.log("Antes de la redirección");
            this.router.navigate(['/validacion', correo]);
            console.log("Después de la redirección");
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
