import { getClientsFromSeller } from '../api/profileClientList.js'
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

export async function getDataFromStorage(sellerID) {
  const user = getCookie('user') || getFromSessionStorage('user')

  if (user) {
    const userFromCookie = JSON.parse(user)
    if (userFromCookie) {
      if (userFromCookie.role === 1) {
        return await getClientsFromSeller('all')
      } else {
        return await getClientsFromSeller(`vendedor?pVendedor=${sellerID}`)
      }
    }
  }
}
