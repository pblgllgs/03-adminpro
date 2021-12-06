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
        /* Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Session iniciada con éxito!!',
          showConfirmButton: false,
          timer: 1500
        }); */
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        Toast.fire({
          icon: 'success',
          title: `Bienvenido`
        })
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.msg
        });
      }
      );
  }

  startApp () {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '266457039172-kn7bevp7kajgu5pkfuassj9sv8fe153n.apps.googleusercontent.com',
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
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              });
              Toast.fire({
                icon: 'success',
                title: `Bienvenido`
              })
            });
          });

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }
}


