import { Component, OnInit } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import Swal from 'sweetalert2';
import { ToastService } from '../../../services/toast.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ModalImageComponent } from '../../../components/modal-image/modal-image.component';
import { ModalImagenService } from '../../../services/modal-imagen.service';

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
  private imgSubs:Subscription;

  constructor(
    private medicoService:MedicoService,
    private toast:ToastService,
    private modalImageService:ModalImagenService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImageService.nuevaImagen
      .pipe(
        delay(300)
      )
      .subscribe(
        img => {
          this.cargarMedicos();
          
        });
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

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: 'Desea eliminar?',
      text: "Esto no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id)
          .subscribe(
            (resp) => {
              this.toast.toast('success', 'Medico eliminado');
              this.cargarMedicos();
            },
            (err) => {
              this.toast.toast('error', 'Datos no fueron Eliminados')
            }
          );
      }
    })
  }

  abrirModal(medico:Medico){
    this.modalImageService.abrirModal('medicos',medico._id,medico.img);
  }

}
