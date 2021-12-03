import { Component, OnInit } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  public medicos:Medico[]= [];
  public medicosTemp:Medico[]= [];
  public cargando:boolean = false;

  constructor(
    private medicoService:MedicoService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        if (medicos.length !== 0) {
          this.medicos = medicos;
        }
        this.medicosTemp = medicos;
      })
  }

}
