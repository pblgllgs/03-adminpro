import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseMedicos } from '../interfaces/ResponseMedicos';
import { map } from 'rxjs/operators';
import { ResponseMedico } from '../interfaces/ResponseMedico';
import { Hospital } from '../models/hospital.model';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    private http:HttpClient
  ) { }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos(){
    const url = `${baseUrl}/medicos`;
    return this.http.get<ResponseMedicos>(url, this.headers)
      .pipe(
        map(resp => resp.medicos)
      );
  }

  crearMedico(medico:{nombre:string, hospital:string}){
    const url = `${baseUrl}/medicos/new`;
    return this.http.post<ResponseMedico>(url,medico, this.headers)
  }

  actualizarMedico(medico:Medico){
    const url = `${baseUrl}/medicos/${medico._id}`;
    return this.http.put<ResponseMedico>(url,medico, this.headers)
  }

  eliminarMedico(_id:string){
    const url = `${baseUrl}/medicos/${_id}`;
    return this.http.delete(url, this.headers)
  }

  buscarMedicoById(_id:string){
    const url = `${baseUrl}/medicos/${_id}`;
    return this.http.get<ResponseMedico>(url,this.headers)
  }
}
