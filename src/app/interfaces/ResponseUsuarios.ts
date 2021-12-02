import { Usuario } from '../models/usuario.model';
export interface ResponseUsuarios{
    total:number,
    usuarios: Usuario[]
}