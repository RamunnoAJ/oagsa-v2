import { navigateToLogin } from '../ui/login.js'
import { getUserFromStorage } from './storageData.js'

export function checkLocalStorage() {
  const user = getUserFromStorage()

  if (user) {
    const userFromCookie = JSON.parse(user)
    return userFromCookie
  } else {
    navigateToLogin()
  }
}
