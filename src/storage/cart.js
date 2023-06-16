export function getCart() {
  return JSON.parse(localStorage.getItem('cart'))
}

export function clearCart() {
  localStorage.setItem('cart', '[]')
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function saveToDraft(cart) {
  if (cart.length === 0) return
  const drafts = getDrafts() || []
  drafts.push(cart)
  localStorage.setItem('draft_cart', JSON.stringify(drafts))
  clearCart()
}

export function getDrafts() {
  if (!localStorage.getItem('draft_cart')) return []
  return JSON.parse(localStorage.getItem('draft_cart'))
}

export function getDraftCart(index){
  return JSON.parse(localStorage.getItem('draft_cart'))[index]
}

export function removeFromDraft(cart) {
  const drafts = getDrafts() || []
  const index = drafts.findIndex(i => i.codigoArticulo === cart.codigoArticulo)
  drafts.splice(index, 1)
  localStorage.setItem('draft_cart', JSON.stringify(drafts))
}
