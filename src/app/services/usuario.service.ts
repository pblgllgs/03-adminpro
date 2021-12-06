import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { ResponseUsuarios } from '../interfaces/ResponseUsuarios';

const baseUrl = environment.base_url;
declare const gapi: any;

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

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role():'ADMIN_ROLE'| 'USER_ROLE'{
    return this.usuario.role;
  }

  googleInit() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '266457039172-kn7bevp7kajgu5pkfuassj9sv8fe153n.apps.googleusercontent.com',
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
        this.guardarLocalSotarage(resp.token,resp.menu);
        return true;
      }), 
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${baseUrl}/usuarios/new`, formData)
      .pipe(
        tap( (resp:any) => {
          this.guardarLocalSotarage(resp.token,resp.menu);
        })
      );
  }

  actualizarPerfil(data:{nombre:string, email:string, role:string}){
    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${baseUrl}/usuarios/${this.uid}`, data,this.headers);
  }

  login(formData: LoginForm) {

    return this.http.post(`${baseUrl}/login`, formData)
      .pipe(
        map((resp: any) => {
          this.guardarLocalSotarage(resp.token,resp.menu);
        })
      );
  }

  loginGoogle(token) {
    return this.http.post(`${baseUrl}/login/google`, { token })
      .pipe(
        map((resp: any) => {
          this.guardarLocalSotarage(resp.token,resp.menu);
        })
      );
  }

  logout() {
    localStorage.removeItem('menu');
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() =>{
        this.router.navigateByUrl('/login');
      });
    });
  }

  cargarUsuarios(desde:number = 0){
    const url = `${baseUrl}/usuarios?desde=${desde}`;
    return this.http.get<ResponseUsuarios>(url, this.headers)
      .pipe(
        map(resp => {
          const usuarios = resp.usuarios.map(user => new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));
          return {
            usuarios,
            total: resp.total
          };
        })
      )
  }

  eliminarUsuario(usuario:Usuario){
    const url = `${baseUrl}/usuarios/${usuario.uid}`
    return this.http.delete(url,this.headers);
  }

  guardarUsuario(usuario:Usuario){
    
    return this.http.put(`${baseUrl}/usuarios/${usuario.uid}`, usuario,this.headers);
  }

  guardarLocalSotarage(token :string, menu:any){

    localStorage.setItem('token',token);
    localStorage.setItem('menu',JSON.stringify(menu));
  }

}
