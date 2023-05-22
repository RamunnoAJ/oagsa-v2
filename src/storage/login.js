import userFromCookie from './storageData.js'

export function checkLocalStorage() {
  if (userFromCookie) {
    window.location.replace('../pages/dashboard.html')
  }
}
