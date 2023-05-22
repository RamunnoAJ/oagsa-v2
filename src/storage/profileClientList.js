import getCookie from './storageData.js'

export function getStorageID() {
  const userFromCookie = JSON.parse(getCookie('user'))

  if (userFromCookie) return userFromCookie.id
  return null
}
