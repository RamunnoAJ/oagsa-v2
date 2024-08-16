import { getClientsFromSeller } from './api/profileClientList.js'
import { getStorageID } from './storage/profileClientAccount.js'
import { getUserFromStorage } from './storage/storageData.js'
import { renderSelect } from './ui/profileOrdersHistory.js'

export async function profileOrdersHistory(parentElement) {
  parentElement.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  const user = JSON.parse(getUserFromStorage())
  if (sellerID) {
    if (user.role !== 3) {
      const clients = await getClientsFromSeller(sellerID)
      renderSelect(clients, parentElement)
    } else {
      renderSelect([{ id: user.idUser, name: user.name }], parentElement)
    }
  }
}
