export function showToast(
  message,
  url = '',
  backgroundColor = 'linear-gradient(to right, #ffd37c, #ff9c35)',
  textColor = '#000000'
) {
  Toastify({
    text: message,
    duration: 3000,
    close: false,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: backgroundColor,
      color: textColor,
    },
    onClick: () => {
      if (url) {
        window.location.replace(url)
      }
    },
  }).showToast()
}
