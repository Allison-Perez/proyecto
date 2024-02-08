import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss'],
})
export class ValidacionComponent implements OnInit {
  correo: string | null = null;
  preguntaSeguridad: string | null = null;
  respuestaUsuario: string = '';
  esValido: boolean = false;
  pregunta: string | null = null;
  seIntentoValidar: boolean = false;
  contrasenaTemporal: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Obtener el valor del correo desde los parámetros de la ruta
      this.correo = params['correo'];

      if (this.correo) {
        this.serviceService.getPreguntaSeguridad(this.correo).subscribe(
          (data: any) => {
            this.preguntaSeguridad = data.idPregunta;
            this.pregunta = data.pregunta;
          },
          (error) => {
            console.error('Error al obtener la pregunta de seguridad:', error);
          }
        );
      }
    });
  }

  validarRespuesta(): void {
    if (this.correo) {
      this.seIntentoValidar = true; // Establece la bandera como verdadera al intentar validar
      // Utiliza el servicioService para verificar la respuesta proporcionada por el usuario
      this.serviceService
        .verificarRespuesta(this.correo, this.respuestaUsuario)
        .subscribe(
          (data: any) => {
            if (data.esValido) {
              this.esValido = true;
              this.contrasenaTemporal = data.contrasenaTemporal; // Agrega esta línea
            } else {
              this.esValido = false;
            }
          },
          (error) => {
            console.error('Error al verificar la respuesta:', error);
          }
        );
    }
  }
}
