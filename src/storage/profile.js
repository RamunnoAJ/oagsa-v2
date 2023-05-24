import { navigateToLogin } from '../ui/login.js'
import { renderUserName } from '../ui/profile.js'
import getCookie from './storageData.js'

export function checkLocalStorage() {
  const user = getCookie('user')

  if (user) {
    const userFromCookie = JSON.parse(user)
    if (!userFromCookie) {
      navigateToLogin()

      renderUserName(userFromCookie.id)
    }
  }
}
