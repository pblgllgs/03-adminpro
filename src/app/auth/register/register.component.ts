import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
export class RegisterComponent  {

  public registerForm = this.fb.group({
    nombre: ['Pablo',[Validators.required,Validators.minLength(4)]],
    email: ['test123@gmail.com',[Validators.required]],
    password: ['123456',[Validators.required,Validators.minLength(4)]],
    passwordVerify: ['123456',[Validators.required,Validators.minLength(4)]],
    terminos: [false,[Validators.required]]
  })

  constructor(private fb:FormBuilder) { }

  crearUsuario(){
    console.log(this.registerForm.value)
  }

}
