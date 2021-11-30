import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.base_url;
declare const gapi: any;

/* interface PerfilForm{
  nombre:string,
  email:string
} */

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario:Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone:NgZone) {
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid():string{
    return this.usuario.uid || '';
  }
  googleInit() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '266457039172-qsqol797lvfiqi89vbk6g3168j4al76n.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${baseUrl}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
        const {nombre,email,img = '',role,google,uid} = resp.usuario;
        this.usuario = new Usuario(nombre,email,'',img,role,google,uid);
      }),
      map((resp:any) => {
        const { email, google, nombre, role, img , uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        localStorage.setItem('token', resp.token );
        return true;
      }), 
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${baseUrl}/usuarios/new`, formData);
  }

  actualizarPerfil(formData:{nombre:string, email:string, role:string}){
    formData = {
      ...formData,
      role: this.usuario.role!
    };
    return this.http.put(`${baseUrl}/usuarios/${this.uid}`, formData,{
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {

    return this.http.post(`${baseUrl}/login`, formData)
      .pipe(
        map((resp: any) => {
          localStorage.setItem('token', resp.token);
          console.log(resp.token);
        })
      );
  }

  loginGoogle(token) {
    return this.http.post(`${baseUrl}/login/google`, { token })
      .pipe(
        map((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() =>{
        this.router.navigateByUrl('/login');
      });
    });
  }

}
