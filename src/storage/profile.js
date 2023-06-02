import { navigateToLogin } from '../ui/login.js'
import { renderUserName } from '../ui/profile.js'
import { getUserFromStorage } from './storageData.js'

export function checkLocalStorage() {
  const user = getUserFromStorage()

  if (user) {
    const userFromCookie = JSON.parse(user)
    renderUserName(userFromCookie.id)
  } else {
    navigateToLogin()
  }
}
