import { getCart, saveCart, clearCart } from './storage/cart.js'
import { showToast } from './ui/cart.js'

export function addToCart(item) {
  const $quantityInput = document.getElementById(
    `quantity-${item.codigoArticulo}`
  )
  const quantity = $quantityInput.value
  if (quantity > 0) {
    const cart = getCart() || []
    const index = cart.findIndex(i => i.codigoArticulo === item.codigoArticulo)

    if (index === -1) {
      addProductToCart(item, quantity)
    } else {
      updateQuantity(item, quantity)
    }
    showToast()
  } else {
    alert('La cantidad debe ser mayor a 0')
  }
}

function addProductToCart(item, quantity) {
  const cart = getCart() || []
  cart.push({
    ...item,
    quantity,
  })
  saveCart(cart)
}

export function removeFromCart(item) {
  const cart = getCart() || []
  cart.splice(cart.indexOf(item), 1)
  saveCart(cart)
}

export function emptyCart() {
  clearCart()
}

export function getTotalPrice() {
  const cart = getCart() || []
  return cart.reduce((acc, item) => acc + item.precio * item.quantity, 0)
}

export function updateQuantity(item, quantity) {
  const cart = getCart() || []
  const index = cart.findIndex(i => i.codigoArticulo === item.codigoArticulo)
  cart[index].quantity = quantity
  saveCart(cart)
}

export function calculateDiscount(total, discount) {
  return total - (total * discount) / 100
}

export function calculateDelivery(total, delivery) {
  if (delivery < 0) return total
  return total + delivery
}
