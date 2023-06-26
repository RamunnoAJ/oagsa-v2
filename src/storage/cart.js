export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || {listaDetalle: []}
}

export function clearCart() {
  localStorage.setItem('cart', '{"listaDetalle": []}')
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function getDrafts() {
  if (!localStorage.getItem('draft_cart')) return []
  return JSON.parse(localStorage.getItem('draft_cart'))
}

export function getDraftCart(id){
  return getDrafts().find(cart => cart.id === id)
}

export function removeFromDraft(id) {
  const drafts = getDrafts()
  const newDrafts = drafts.filter(cart => cart.id !== id)
  localStorage.setItem('draft_cart', JSON.stringify(newDrafts))
}
