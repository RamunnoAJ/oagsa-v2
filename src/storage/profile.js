import { renderUserName } from '../ui/profile.js'
import { userFromCookie } from './storageData.js'

export function checkLocalStorage() {
  if (!userFromCookie) {
    window.location.replace('../pages/log-in.html')

    renderUserName(userFromCookie.id)
  }
}
