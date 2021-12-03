import { Hospital } from '../models/hospital.model';

export interface ResponseHospital {
    hospital: Hospital,
    msg:string,
    ok: boolean

}
