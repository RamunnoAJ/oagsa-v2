export function getCart() {
  return JSON.parse(localStorage.getItem('cart'))
}

export function clearCart() {
  localStorage.setItem('cart', '[]')
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}
