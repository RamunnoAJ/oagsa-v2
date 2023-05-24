import { getClientsFromSeller } from '../api/profileClientList.js'
import getCookie from './storageData.js'

export function getStorageID() {
  const userFromCookie = JSON.parse(getCookie('user'))
  if (userFromCookie) return userFromCookie.id
  return null
}

export async function getDataFromStorage(sellerID) {
  const userFromCookie = JSON.parse(getCookie('user'))
  if (userFromCookie) {
    if (userFromCookie.role === 1) {
      return await getClientsFromSeller('all')
    } else {
      return await getClientsFromSeller(`vendedor?pVendedor=${sellerID}`)
    }
  }
}
