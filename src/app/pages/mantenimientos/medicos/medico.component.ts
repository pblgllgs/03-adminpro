import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from '../../../services/medico.service';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Medico } from '../../../models/medico.model';
import { ResponseMedico } from '../../../interfaces/ResponseMedico';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public medicoForm: FormGroup;
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;
  public imgSubs:Subscription;

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private toast: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalImageService:ModalImagenService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarMedico(id);
    })

    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      hospital: ['', [Validators.required]]
    });
    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
      });

      this.imgSubs = this.modalImageService.nuevaImagen
      .pipe(
        delay(150)
      )
      .subscribe(
        img => {
          this.cargarMedico(this.medicoSeleccionado._id);
        });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe;
  }

  cargarMedico(id: string) {
    if(id === 'nuevo'){
      return;
    }
    this.medicoService.buscarMedicoById(id)
      .pipe(
        //para evitar que no alcance a cargar
        delay(150)
      )
      .subscribe(resp => {
        if(!resp.medico){
          this.router.navigateByUrl(`/dashboard/medicos`);
        }
        const { nombre, hospital: { _id } } = resp.medico;
        this.medicoSeleccionado = resp.medico;
        this.medicoForm.setValue({ nombre, hospital: _id })
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe(resp => {
        this.hospitales = resp;
      })
  }

  guardarMedico() {
    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
        .subscribe(
          (resp: ResponseMedico) => {
            this.toast.toast('success', `Médico ${resp.medico.nombre} actualizado`);
            this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
          },
          (err) => {
            this.toast.toast('error', 'Operación no realizada');

          });
    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe(
          (resp: ResponseMedico) => {
            this.toast.toast('success', `Médico ${resp.medico.nombre} registrado.`);
            this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
          },
          (err) => {
            this.toast.toast('error', 'Operación no realizada');

          });
    }

  }

  abrirModal(medico:Medico){
    this.modalImageService.abrirModal('medicos',medico._id,medico.img);
  }
}
