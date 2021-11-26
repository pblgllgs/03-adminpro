import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email'), [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    remember: [false]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone:NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp => {
        if ( this.loginForm.get('remember')!.value ){ 
          localStorage.setItem('email', this.loginForm.get('email')!.value );
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Session iniciada con éxito!!',
          showConfirmButton: false,
          timer: 1500
        });
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.msg,
          footer: '<a href="">Why do I have this issue?</a>'
        });
      }
      );
  }

  startApp () {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '266457039172-qsqol797lvfiqi89vbk6g3168j4al76n.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp();
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        localStorage.removeItem('email');
        this.usuarioService.loginGoogle(id_token)
          .subscribe(resp => {
            this.ngZone.run(() =>{
              this.router.navigateByUrl('/');
            });
          });

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }
}


