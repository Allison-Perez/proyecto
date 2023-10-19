import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-perfil-detalle',
  templateUrl: './perfil-detalle.component.html',
  styleUrls: ['./perfil-detalle.component.css'],
})
export class PerfilDetalleComponent implements OnInit {
  perfil: any; 

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.perfil = params;
    });
  }
}
