import Swal from 'sweetalert2'

const instance = Swal.mixin({
  toast: true,
  position: 'top',
  timer: 2000,
  showConfirmButton: false,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export const success = (msg: string) => {
  instance.fire({
    icon: 'success',
    text: msg,
  })
}

export const error = (msg: string) => {
  instance.fire({
    icon: 'error',
    text: msg,
  })
}
