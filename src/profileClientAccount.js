import {
  getStorageID,
  getDataFromStorage,
} from './storage/profileClientAccount.js'
import { getUserFromStorage } from './storage/storageData.js'
import { renderProfileClientAccount } from './ui/profileClientAccount.js'

export async function profileClientAccount($profileInfoContainer) {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'
  const user = JSON.parse(getUserFromStorage())

  if (user.role === 3) {
    renderProfileClientAccount(
      [{ id: user.idUser, name: user.name }],
      $profileInfoContainer
    )
  } else {
    const sellerID = getStorageID()
    const clients = await getDataFromStorage(sellerID)

    renderProfileClientAccount(clients, $profileInfoContainer)
  }
}
