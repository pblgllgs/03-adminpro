import { Medico } from '../models/medico.model';

export interface ResponseMedicos {
    medicos: Medico[],
    ok: boolean
}