import { userFromCookie } from './storageData.js'

export function getStorageID() {
  if (userFromCookie) return userFromCookie.id
  return null
}
