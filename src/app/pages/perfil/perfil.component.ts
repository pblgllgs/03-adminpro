import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { EmailValidatorService } from '../../services/email-validator.service';
import { Usuario } from '../../models/usuario.model';
import { ValidatorService } from '../../services/validator.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm:FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp:any = '';

  constructor(
    private fb:FormBuilder,
    private usuarioService:UsuarioService,
    private emailValidatorService:EmailValidatorService,
    private validator:ValidatorService,
    private fileUploadService:FileUploadService){
      this.usuario = usuarioService.usuario;
     }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre,[Validators.required, Validators.minLength(4), Validators.pattern(this.validator.nombrePattern)]],
      email: [this.usuario.email,[Validators.required,Validators.pattern(this.validator.emailPattern)]]
    });
  }

  campoNoValido(campo :string){
    return this.perfilForm.get(campo)?.invalid && this.perfilForm.get(campo)?.touched;
  }

  get emailErrorMsg():string{
    const errors = this.perfilForm.get('email')?.errors;
    if(errors?.required){
      return 'el email es obligatorio';
    }else if(errors?.pattern){
      return 'El formato del correo no es valido';
    }
    return '';
  }

  get nombreErrorMsg():string{
    const errors = this.perfilForm.get('nombre')?.errors;
    console.log(errors.pattern)
    if(errors?.required){
      return 'el nombre es obligatorio';
    }else if(errors?.pattern){
      return 'El formato del nombre no es correcto';
    }
    return '';
  }

  actualizarPerfil(){
    console.log(this.perfilForm);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe( resp => {
        const {nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Guardado','Cambios guardados','success');
      },
      (err) => {
        Swal.fire('El email ya existe',err.error.msg,'error');
      }
      );
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
    this.fileUploadService.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid)
      .then( img => {
        this.usuario.img = img;
        Swal.fire('Guardado','Imagen actualizada','success');
      },
      (err) => {
        Swal.fire('Error','La imagen no se pudo actualizar','error');
      });

  }
}
