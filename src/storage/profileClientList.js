import { getFromSessionStorage } from './sessionData.js'
import getCookie from './storageData.js'

export function getStorageID() {
  const user = getCookie('user') || getFromSessionStorage('user')
  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) return userFromCookie.id
    return null
  }
}
