import { renderUserName } from '../profile.js'
import { localStorageID, sessionStorageID } from './storageData.js'

export function checkLocalStorage() {
  if (localStorageID === 0 && sessionStorageID === 0) {
    window.location.replace('../pages/log-in.html')
  }

  if (sessionStorageID) {
    renderUserName(sessionStorageID)
  }
  if (localStorageID) {
    renderUserName(localStorageID)
  }
}
