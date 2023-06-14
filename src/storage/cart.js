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
  localStorage.setItem('draft_cart', JSON.stringify(cart))
}

export function getDraftCart() {
  return JSON.parse(localStorage.getItem('draft_cart'))
}
