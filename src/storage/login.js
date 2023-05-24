import { navigateToDashboard } from '../ui/login.js'
import { getFromSessionStorage } from './sessionData.js'
import getCookie from './storageData.js'

export function checkLocalStorage() {
  const user = getCookie('user') || getFromSessionStorage('user')
  console.log(user)

  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) {
      navigateToDashboard()
    }
  }
}
