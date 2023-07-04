import { getDraft, getDrafts, removeDraft } from "./api/profileDrafts.js"
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
  try {
    triggerSweetAlert('Desea eliminar el borrador?', 'Esta acción no es reversible', 'Eliminar', 'Eliminado!', 'El borrador ha sido eliminado.', removeDraft(draftID))
  } catch (error) {
    Toastify({
      text: error.message,
      duration: 3000,
      close: false,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #a25553, #79403e)',
        color: '#000000',
      }
    }).showToast()
  }
}

export async function editDraft(draftID) {
  const draft = await getDraft(draftID)
  saveCart(draft)

  navigateToCart()
}
