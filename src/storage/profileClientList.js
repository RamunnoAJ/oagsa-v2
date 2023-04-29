import { localStorageID, sessionStorageID } from './storageData.js'

export function getStorageID() {
  if (localStorageID) return localStorageID
  if (sessionStorageID) return sessionStorageID
  return null
}
