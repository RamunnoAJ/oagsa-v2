import { getClientsFromSeller } from './api/profileClientList.js'
import { getStorageID } from './storage/profileClientAccount.js'
import { renderSelect } from './ui/profileOrdersHistory.js'

export async function profileOrdersHistory(parentElement) {
  parentElement.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  if (sellerID) {
    const clients = await getClientsFromSeller(sellerID)
    renderSelect(clients, parentElement)
  }
}
