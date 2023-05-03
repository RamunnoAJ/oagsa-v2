import { getClientsFromSeller } from '../api/profileClientList.js'
import {
  localStorageID,
  localStorageSession,
  sessionStorageID,
  sessionStorageSession,
} from './storageData.js'

export function getStorageID() {
  if (localStorageID) return localStorageID
  if (sessionStorageID) return sessionStorageID
  return null
}

export async function getDataFromStorage(sellerID) {
  if (sessionStorageSession === 1 || localStorageSession === 1) {
    return await getClientsFromSeller('all')
  } else {
    return await getClientsFromSeller(`vendedor?pVendedor=${sellerID}`)
  }
}
