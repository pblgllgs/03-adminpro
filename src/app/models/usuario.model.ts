

export class Usuario {
    constructor(
        private nombre:string,
        private email:string,
        private password:string,
        private img?:string,
        private google?:boolean,
        private role?:string,
        private uid?:string
    ) {}
}