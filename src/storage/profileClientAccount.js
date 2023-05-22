import { getClientsFromSeller } from '../api/profileClientList.js'
import userFromCookie from './storageData.js'

export function getStorageID() {
  if (userFromCookie) return userFromCookie.id
  return null
}

export async function getDataFromStorage(sellerID) {
  if (userFromCookie) {
    if (userFromCookie.role === 1) {
      return await getClientsFromSeller('all')
    } else {
      return await getClientsFromSeller(`vendedor?pVendedor=${sellerID}`)
    }
  }
}
