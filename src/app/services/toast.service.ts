import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toast(accion: string, msg: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    switch (accion) {
      case 'success':
        Toast.fire({
          icon: 'success',
          title: `${msg}`
        })
        break;
      case 'error':
        Toast.fire({
          icon: 'error',
          title: `${msg}`
        })
        break;
    }


  }
}
