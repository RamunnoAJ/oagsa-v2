import { getStorageID } from './storage/profileClientList.js'
import { renderClientsFromSeller } from './ui/profileClientList.js'
import { getClientsFromSeller } from './api/profileClientList.js'

export const profileClientList = async $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  const clients = await getClientsFromSeller(`vendedor?pVendedor=${sellerID}`)

  renderClientsFromSeller(clients, $profileInfoContainer)
}
