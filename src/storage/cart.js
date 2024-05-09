/** @typedef {import('./entities/orders.js').Order} Order */

/**
 * @returns {Order}
 * */
export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || { detail: [] }
}

export function clearCart() {
  localStorage.setItem('cart', '{"detail": []}')
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}
