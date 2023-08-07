import { getClientsFromSeller } from '../api/profileClientList.js'
import { getUserFromStorage } from './storageData.js'

export function getStorageID() {
  const user = getUserFromStorage()

  if (user) {
    const userFromCookie = JSON.parse(user)
    if (userFromCookie) return userFromCookie.id
    return null
  }
}

export async function getDataFromStorage(sellerID) {
  const user = getUserFromStorage()

  if (user) {
    const userFromCookie = JSON.parse(user)
    if (userFromCookie) {
      return await getClientsFromSeller(sellerID)
    }
  }
}
