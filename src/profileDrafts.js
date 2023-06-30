import { getDraft, getDrafts } from "./api/profileDrafts.js"
import { saveCart } from "./storage/cart.js"
import { getStorageID } from "./storage/profileClientAccount.js"
import { navigateToCart, renderDrafts } from "./ui/profileDrafts.js"
import { triggerSweetAlert } from "./utils/sweetAlert.js"

export async function profileDrafts($profileInfoContainer) {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  const drafts = await getDrafts(sellerID)

  renderDrafts(drafts, $profileInfoContainer)
}

export function deleteDraft(draftID) {
  // TODO: using the delete draft endpoint, remove it from the db and clear the cart
  triggerSweetAlert('Desea eliminar el borrador?', 'Esta acción no es reversible', 'Eliminar', 'Eliminado!', 'El borrador ha sido eliminado.')

  console.log(draftID)
}

export async function editDraft(draftID) {
  const draft = await getDraft(draftID)
  saveCart(draft)

  navigateToCart()
}
