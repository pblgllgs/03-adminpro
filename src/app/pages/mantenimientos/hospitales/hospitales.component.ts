import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { ResponseHospitales } from '../../../interfaces/ResponseHospitales';
import { ToastService } from '../../../services/toast.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs:Subscription;


  constructor(
    private hospitalService: HospitalService,
    private toast: ToastService,
    private modalImageService:ModalImagenService,
    private busquedasService:BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe;
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImageService.nuevaImagen
      .pipe(
        delay(300)
      )
      .subscribe(
        img => {
          this.cargarHospitales();
          
        });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        this.toast.toast('success', 'Datos Actualizados')
      },
        (err) => {
          this.toast.toast('error', 'Datos no fueron Actualizados')
        });
  }

  eliminarHospital(hospital: Hospital) {
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
        this.hospitalService.eliminarHospital(hospital._id)
          .subscribe(
            (resp) => {
              this.toast.toast('success', 'Hospital eliminado');
              this.cargarHospitales();
            },
            (err) => {
              this.toast.toast('error', 'Datos no fueron Eliminados')
            }
          );
      }
    })
  }

  async abrirSweetModal() {
    const { value= '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingresa el nombre del Hospital',
      input: 'text',
      showCancelButton: true,
    })

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe(resp => {
          this.toast.toast('success', 'Hospital guardado!');
          this.cargarHospitales();
        });
    }
  }

  abrirModal(hospital:Hospital){
    this.modalImageService.abrirModal('hospitales',hospital._id,hospital.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedasService.buscar('hospitales', termino)
      .subscribe((resp:Hospital[]) => {
        this.hospitales = resp;
      });
  }

}
