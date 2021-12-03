import { Usuario } from '../models/usuario.model';
import { Medico } from '../models/medico.model';
import { Hospital } from '../models/hospital.model';

export interface ResponseGlobal{
    ok:boolean,
    usuarios:Usuario[],
    medicos:Medico[],
    hospitales:Hospital[]
  }