import {
  getStorageID,
  getDataFromStorage,
} from './storage/profileClientAccount.js'
import { renderProfileClientAccount } from './ui/profileClientAccount.js'

export const profileClientAccount = async $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  const clients = await getDataFromStorage(sellerID)

  renderProfileClientAccount(clients, $profileInfoContainer)
}
