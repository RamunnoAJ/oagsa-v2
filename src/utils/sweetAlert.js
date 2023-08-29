/**
 * @param {string} title
 * @param {string} text
 * @param {string} confirmButtonText
 * @param {string} fireTitle
 * @param {string} fireText
 * @param {function} callback
 * */
export async function triggerSweetAlert(
  title,
  text,
  confirmButtonText,
  fireTitle,
  fireText,
  callback = () => {}
) {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff9c35',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    background: '#fff',
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire(fireTitle, fireText, 'success').then(() => {
        callback()
      })
    }
  })
}
