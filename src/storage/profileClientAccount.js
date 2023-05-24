import { getClientsFromSeller } from '../api/profileClientList.js'
import getCookie from './storageData.js'

const user = getCookie('user')
export function getStorageID() {
  if (user) {
    const userFromCookie = JSON.parse(user)
    if (userFromCookie) return userFromCookie.id
    return null
  }
}

export async function getDataFromStorage(sellerID) {
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
