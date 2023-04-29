import getDataFromDB from '../utils/getDataFromDB.js'
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
    return await getDataFromDB('http://api.oagsa.com/api/cliente/all')
  } else {
    return await getDataFromDB(
      `http://api.oagsa.com/api/cliente/vendedor?pVendedor=${sellerID}`
    )
  }
}
