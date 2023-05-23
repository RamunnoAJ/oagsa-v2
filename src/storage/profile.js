import { navigateToLogin } from '../ui/login.js'
import { renderUserName } from '../ui/profile.js'
import getCookie from './storageData.js'

export function checkLocalStorage() {
  const userFromCookie = JSON.parse(getCookie('user'))
  if (!userFromCookie) {
    navigateToLogin()

    renderUserName(userFromCookie.id)
  }
}
