import { environment } from '../../environments/environment';
import { Hospital } from './hospital.model';
import { Usuario } from './usuario.model';

const base_url = environment.base_url;

export class Medico {
    constructor(
        public nombre:string,
        public usuario:Usuario,
        public hospital:Hospital,
        public img?:string,
        public uid?:string
    ) {}

    get imageUrl(){

        if(!this.img){
            return `${base_url}/upload/medicos/no-img`;
        }else if(this.img?.includes('https')){
            return this.img;
        }else if(this.img){
            return `${base_url}/upload/medicos/${this.img}`;
        }else{
            return `${base_url}/upload/medicos/no-img`;
        }
    }
    
}