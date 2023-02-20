import Swal from 'sweetalert2'

const instance = Swal.mixin({
  toast: true,
  position: 'top',
  timer: 2000,
  showConfirmButton: false,
  timerProgressBar: true,
  width: '35em',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export const success = (msg: string, title?: string) => {
  instance.fire({
    icon: 'success',
    title,
    text: msg,
  })
}

export const error = (msg: string, title?: string) => {
  instance.fire({
    icon: 'error',
    title,
    text: msg,
  })
}
