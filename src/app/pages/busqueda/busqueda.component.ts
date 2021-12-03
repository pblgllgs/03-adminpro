import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Medico } from '../../models/medico.model';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios:Usuario[]=[];
  public medicos:Medico[]=[];
  public hospitales:Hospital[]=[];

  constructor(
    private activatedRoute:ActivatedRoute,
    private busquedasService:BusquedasService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({termino}) => {
        this.busquedaGlobal(termino)
      })
  }

  busquedaGlobal(termino:string){
    this.busquedasService.busquedaGlobal(termino)
      .subscribe(resp => {
        this.usuarios = resp.usuarios;
        this.hospitales = resp.hospitales;
        this.medicos = resp.medicos;
      })
  }

}
