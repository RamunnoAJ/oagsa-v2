import getCookie from './storageData.js'

export function getStorageID() {
  const user = getCookie('user')
  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) return userFromCookie.id
    return null
  }
}
