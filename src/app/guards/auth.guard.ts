import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService:UsuarioService, private router:Router){}
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuarioService.validarToken()
      .pipe(
        tap(isAuthenticated => {
          if(!isAuthenticated){
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
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
