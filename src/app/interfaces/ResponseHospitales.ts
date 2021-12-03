import { Hospital } from '../models/hospital.model';

export interface ResponseHospitales {
    hospitales: Hospital[],
    ok: boolean

}
