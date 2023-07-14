import { navigateToLogin } from '../ui/login.js'
import { getUserFromStorage } from './storageData.js'

export async function checkLocalStorage() {
  const user = getUserFromStorage()

  if (user) {
    const userFromCookie = JSON.parse(user)
    return userFromCookie
  } else {
    if (window.location.href.includes('dashboard') || window.location.href.includes('store')) {
      navigateToLogin()
    }
  }
}
