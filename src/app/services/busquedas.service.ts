import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Medico } from '../models/medico.model';
import { Hospital } from '../models/hospital.model';
import { ResponseGlobal } from '../interfaces/ResponseGlobal';


const baseUrl = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient
    ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /* private transform(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  } */

  busquedaGlobal(termino:string){
    const url = `${baseUrl}/todo/${termino}`;
    return this.http.get<ResponseGlobal>(url, this.headers);
  }

  buscar(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string) {
    const url = `${baseUrl}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<Usuario[] | Medico[] | Hospital[]>(url, this.headers)
      .pipe(
        map(
          (resp: any) => {
            switch (tipo) {
              case 'usuarios':
                return resp.resultados.map(
                  user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                );
              case 'medicos':
                return resp.resultados.map(
                  medico => new Medico(medico.nombre, medico.hospital, medico.img, medico.id)
                );
              case 'hospitales':
                return resp.resultados.map(
                  hospital => new Hospital(hospital.nombre, hospital.usuario, hospital.img, hospital.id)
                );
                break;
              default:
                return [];
            }
          }
        )
      );
  }

}