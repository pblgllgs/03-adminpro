import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[] = []
  public usuariosTemp: Usuario[] = []
  public totalUsuarios: number = 0;
  public desde: number = 0;
  public cargando: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasSerice: BusquedasService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        //si la siguiente carga de tantos usuarios es 0, no hace la siguiente carga
        if (usuarios.length !== 0) {
          this.usuarios = usuarios;
        }
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasSerice.buscar('usuarios', termino)
      .subscribe(resp => {
        this.usuarios = resp;
      });
  }

  eliminarUsuario(usuario: Usuario) {
    if(usuario.uid === this.usuarioService.usuario.uid){
      return Swal.fire('Aviso','Operación imposible de realizar','info');
    }
    Swal.fire({
      title: `Borrar Usuario ${usuario.nombre}`,
      text: "Esta ccion no se puede revertir!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            Swal.fire(
              'Eliminado!',
              'EL archivo ha sido eliminado.',
              'success'
            )
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.msg.error
            })
          });
      }
    })
    this.cargarUsuarios();
  }
}
