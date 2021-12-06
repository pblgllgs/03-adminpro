import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
export class RegisterComponent  {

  public formSubmiteed: boolean= false;

  /* public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  get emailErrorMsg():string{
    const errors = this.registerForm.get('email')?.errors;
    if(errors?.required){
      return 'el email es obligatorio';
    }else if(errors?.pattern){
      return 'El formato del correo no es valido';
    }
    return '';
  } */

  public registerForm = this.fb.group({
    nombre: ['test1',[Validators.required,Validators.minLength(4)]],
    email: ['test1@gmail.com',[Validators.required, Validators.email]],
    password: ['1234',[Validators.required,Validators.minLength(4)]],
    passwordVerify: ['1234',[Validators.required,Validators.minLength(4)]],
    terminos: [true,[Validators.required]]
  },
  {
    validators: this.passwordsIguales('password','passwordVerify')
  }
  );

  constructor(
    private fb:FormBuilder,
    private usuarioService:UsuarioService,
    private router:Router) { }

  crearUsuario(){
    this.formSubmiteed= true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe( resp => {
        this.router.navigateByUrl('/login');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario registrado',
          showConfirmButton: false,
          timer: 1500
        });
      },(err) => {
         Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.msg
        });
      });
  }

  campoNoValido(campo:string){
    if(this.registerForm.get(campo)?.invalid && this.formSubmiteed){
      return true;
    }else{
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmiteed
  }

  passwordNoValidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('passwordVerify')?.value;
    if((pass1 !== pass2) && this.formSubmiteed){
      return true;
    }
    else{
      return false;
    }
  }

  passwordsIguales(pass1:string, pass2:string){
    return (formGroup:FormGroup)=> {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if(pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null)
      }else{
        pass2Control?.setErrors({noEsIgual: true})
      }
    }
  }

}
