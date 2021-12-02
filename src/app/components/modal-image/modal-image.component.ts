import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';
import { ToastService } from '../../services/toast.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent implements OnInit {

  public imagenSubir:File;
  public imgTemp:any = '';

  constructor(
    public modalImageService:ModalImagenService,
    private fileUploadService:FileUploadService,
    private toastService:ToastService) {}

  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalImageService.cerrarModal();
    this.imgTemp = null;
  }

  cambiarImagen(event){
    const file = event.target.files[0];
    this.imagenSubir = file;

    if(!file){
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend= () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    const id = this.modalImageService.id;
    const tipo =  this.modalImageService.tipo;
    this.fileUploadService.actualizarFoto(this.imagenSubir,tipo,id)
      .then( img => {
        this.toastService.toast('success','Imagen actualizada');
        this.modalImageService.nuevaImagen.emit(img);
        this.cerrarModal();
      },
      (err) => {
        this.toastService.toast('error','Imagen no se pudo actualizar');
        this.cerrarModal();
      });
  }

}
