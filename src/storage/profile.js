import { renderUserName } from '../ui/profile.js'
import getCookie from './storageData.js'

export function checkLocalStorage() {
  const userFromCookie = JSON.parse(getCookie('user'))
  if (!userFromCookie) {
    window.location.replace('../pages/log-in.html')

    renderUserName(userFromCookie.id)
  }
}
