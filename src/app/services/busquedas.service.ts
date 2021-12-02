import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Medico } from '../models/medico.model';
import { Hospital } from '../models/hospital.model';


const baseUrl = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

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

  private tranformUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private tranformMedicos(resultados: any[]): Medico[] {
    return resultados.map(
      medico => new Medico(medico.nombre, medico.hospital,medico.img ,medico.id)
    );
  }

  private tranformHospitales(resultados: any[]): Hospital[] {
    return resultados.map(
      hospital => new Hospital(hospital.nombre,hospital.usuario,hospital.img, hospital.id)
    );
  }

  buscar(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string) {
    const url = `${baseUrl}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map(
          (resp: any) => {
            switch (tipo) {
              case 'usuarios':
                return this.tranformUsuarios(resp.resultados);
                break;
              case 'medicos':
                return this.tranformMedicos(resp.resultados);
                break;
              case 'hospitales':
                return this.tranformHospitales(resp.resultados);
                break;
              default:
                return [];
            }
          }
        )
      );
  }

}