export function showToast(message, url = '') {
  Toastify({
    text: message,
    duration: 3000,
    close: false,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: 'linear-gradient(to right, #ffd37c, #ff9c35)',
      color: '#000000',
    },
    onClick: () => {
      if (url) {
        window.location.replace(url)
      }
    },
  }).showToast()
}
