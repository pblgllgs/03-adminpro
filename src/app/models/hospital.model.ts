import { Usuario } from "./usuario.model"
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Hospital {
    constructor(
        public nombre: string,
        public usuario: Usuario,
        public img:string,
        public id:string
        ) {
    }

    get imageUrl(){

        if(!this.img){
            return `${base_url}/upload/hospitales/no-img`;
        }else if(this.img?.includes('https')){
            return this.img;
        }else if(this.img){
            return `${base_url}/upload/hospitales/${this.img}`;
        }else{
            return `${base_url}/upload/hospitales/no-img`;
        }
    }

}