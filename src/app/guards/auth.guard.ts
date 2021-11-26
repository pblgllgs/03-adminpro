import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService:UsuarioService, private router:Router){}
  
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):Observable<boolean> {
    return this.usuarioService.validarToken()
      .pipe(
        tap(isAuthenticated => {
          if(!isAuthenticated){
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
}
