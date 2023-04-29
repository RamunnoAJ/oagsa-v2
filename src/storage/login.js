import { localStorageID, sessionStorageID } from './storageData.js'

export function checkLocalStorage() {
  if (localStorageID !== null || sessionStorageID !== null) {
    window.location.replace('../pages/dashboard.html')
  }
}
