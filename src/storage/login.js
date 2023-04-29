import { localStorageID, sessionStorageID } from './storageData.js'

export function checkLocalStorage() {
  if (localStorageID !== 0 || sessionStorageID !== 0) {
    window.location.replace('../pages/dashboard.html')
  }
}
