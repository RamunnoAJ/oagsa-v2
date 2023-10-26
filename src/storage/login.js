import { navigateToDashboard } from '../ui/login.js'
import { getUserFromStorage } from './storageData.js'

export async function checkLocalStorage() {
  const user = getUserFromStorage()

  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) {
      navigateToDashboard()
    }
  }
}
