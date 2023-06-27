export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || {listaDetalle: []}
}

export function clearCart() {
  localStorage.setItem('cart', '{"listaDetalle": []}')
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

