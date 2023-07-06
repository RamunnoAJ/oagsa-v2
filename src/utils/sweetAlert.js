import { emptyCart } from "../cart.js"
import { navigateToDashboard } from "../ui/login.js"

export async function triggerSweetAlert(title, text, confirmButtonText, fireTitle, fireText, callback = () => {}) {
  Swal.fire({
  title: title,
  text: text,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#ff9c35',
  cancelButtonColor: '#d33',
  confirmButtonText: confirmButtonText,
  cancelButtonText: 'Cancelar',
  background: '#fff'
  }).then((result) => {
    if (result.isConfirmed) {
      callback()
      Swal.fire(
        fireTitle,
        fireText,
        'success'
      ).then(() => {
        emptyCart()
        navigateToDashboard()
      })
    }
  })
}
