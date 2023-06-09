export function showToast() {
  // eslint-disable-next-line no-undef
  Toastify({
    text: 'Objeto añadido correctamente',
    duration: 3000,
    close: false,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: 'linear-gradient(to right, #ffd37c, #ff9c35)',
      color: '#000000',
    },
  }).showToast()
}
