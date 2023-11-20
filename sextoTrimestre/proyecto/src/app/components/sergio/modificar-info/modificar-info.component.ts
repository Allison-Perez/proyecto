// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { ServiceService } from '../service/service.service';
// import {  Router } from '@angular/router';

// @Component({
//   selector: 'app-modificar-info',
//   templateUrl: './modificar-info.component.html',
//   styleUrls: ['./modificar-info.component.scss'],
// })
// export class ModificarInfoComponent implements OnInit {
//   selectedRol: string = '';
//   correo: string = '';
//   usuario: any = {}; // Ajusta esto según la estructura de tu usuario

//   constructor(
//     private route: ActivatedRoute,
//     private serviceService: ServiceService,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       this.correo = params['correo'];
//       this.obtenerUsuarioPorCorreo();
//     })
//   }

//   obtenerUsuarioPorCorreo(): void {
//     // Verifica que this.correo esté definido
//     if (!this.correo) {
//       console.error('Correo no definido. No se puede obtener la información del usuario.');
//       return;
//     }

//     this.serviceService.getUserInfoByEmail(this.correo)
//       .subscribe(data => {
//         this.usuario = data;
//         this.selectedRol = this.usuario.rol.toString();
//       });
//   }


//   guardarCambios(): void {

//     console.log('entra a guardar cambios');

//     if (!this.correo) {
//       console.error('Correo no definido. No se puede actualizar el usuario.');
//       return;
//     }

//     // Asigna el nuevo rol al usuario antes de realizar la actualización
//     this.usuario.rol = parseInt(this.selectedRol, 10);

//     console.log('Datos antes de la actualización:', this.usuario);

//     // Lógica para guardar los cambios en el servicio
//     this.serviceService.updateUserInfo(this.usuario)
//   .subscribe(response => {
//     console.log('Usuario actualizado:', response);

//     if (this.correo) {
//       // Espera 3 segundos y redirige al componente modificar-usuarios
//       setTimeout(() => {
//         this.router.navigate(['/modificar-usuarios']);
//       }, 3000);
//     } else {
//       console.error('Correo no definido. No se puede redirigir al componente modificar-usuarios.');
//     }
//   });

//   }

// }
