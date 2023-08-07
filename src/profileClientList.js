import { getStorageID } from './storage/profileClientList.js'
import { renderClientsFromSeller } from './ui/profileClientList.js'
import { getClientsFromSeller } from './api/profileClientList.js'

export async function profileClientList($profileInfoContainer) {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  const clients = await getClientsFromSeller(sellerID)

  renderClientsFromSeller(clients, $profileInfoContainer)
}
