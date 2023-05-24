import { getUserFromStorage } from './storageData.js'

export function getStorageID() {
  const user = getUserFromStorage()
  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) return userFromCookie.id
    return null
  }
}
