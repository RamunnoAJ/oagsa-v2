import { getClientsFromSeller } from "./api/profileClientList.js"
import { getOrders } from "./api/profileOrdersHistory.js"
import { getStorageID } from "./storage/profileClientAccount.js"
import { renderOrders, renderSelect } from "./ui/profileOrdersHistory.js"

export async function profileOrdersHistory(parentElement){
  parentElement.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  if (sellerID) {
    const clients = await getClientsFromSeller(sellerID)
    renderSelect(clients, parentElement)
    
    const orders = await getOrders(sellerID)
    renderOrders(orders, parentElement)
  }
}
