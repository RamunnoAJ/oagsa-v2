import { navigateToDashboard } from '../ui/login.js'
import getCookie from './storageData.js'

export function checkLocalStorage() {
  const user = getCookie('user')

  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) {
      navigateToDashboard()
    }
  }
}
