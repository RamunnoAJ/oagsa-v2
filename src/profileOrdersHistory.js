import { getOrders } from "./api/profileOrdersHistory.js"
import { getStorageID } from "./storage/profileClientAccount.js"
import { renderOrders } from "./ui/profileOrdersHistory.js"

export async function profileOrdersHistory(parentElement){
  parentElement.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  if (sellerID) {
    const orders = await getOrders(sellerID)
    renderOrders(orders, parentElement)
  }
}
