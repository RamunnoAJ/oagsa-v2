const cookies = document.cookie.split('; ')
export let userFromCookie

for (let i = 0; i < cookies.length; i++) {
  const cookie = cookies[i].split('=')
  if (cookie[0] === 'user') {
    const usuarioDesencriptado = cookie[1]
    userFromCookie = JSON.parse(usuarioDesencriptado)
    break
  }
}
