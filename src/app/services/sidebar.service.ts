import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu'))|| [];
  }

  /* menu:any[] =[
    {
      titulo:'Principal',
      icon:'mdi mdi-gauge',
      submenu: [
        {titulo: 'Main', url:'/'},
        {titulo: 'Gráficas', url:'grafica1'},
        {titulo: 'Perfil', url:'perfil'},
        {titulo: 'ProgressBar', url:'progress'},
        {titulo: 'Promesas', url:'promesas'},
        {titulo: 'Rxjs', url:'rxjs'}
      ]
    },
    {
      titulo:'Mantenimiento',
      icon:'mdi mdi-folder-lock-open',
      submenu: [
        {titulo: 'Usuarios', url:'usuarios'},
        {titulo: 'Hospitales', url:'hospitales'},
        {titulo: 'Médicos', url:'medicos'},
      ]
    }
  ]; */

  constructor() { }
}
