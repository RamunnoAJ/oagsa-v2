import getCookie from './storageData.js'

export function checkLocalStorage() {
  const userFromCookie = JSON.parse(getCookie('user'))

  if (userFromCookie) {
    window.location.replace('../pages/dashboard.html')
  }
}
