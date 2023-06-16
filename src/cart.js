import { getCart, getDrafts, saveToDraft, saveCart, clearCart } from './storage/cart.js'
import { checkLocalStorage } from './storage/profile.js'
import { showToast } from './ui/cart.js'

checkLocalStorage()

export function checkout() {
  const cart = getCart() || []
  console.log(cart)
//    clearCart()
  showToast('Compra finalizada.')
}

export function addToCart(item) {
  const quantityInputId = `quantity-${item.codigoArticulo}`
  const $quantityInput = document.getElementById(quantityInputId)
  const quantity = $quantityInput.value

  if (quantity > 0) {
    const cart = getCart() || []
    const index = cart.findIndex(i => i.codigoArticulo === item.codigoArticulo)

    if (index === -1) {
      addProductToCart(item, quantity)
    } else {
      updateQuantity(item, quantity)
    }

    showToast('Objeto añadido correctamente.')
  } else {
    alert('La cantidad debe ser mayor a 0')
  }
}

function addProductToCart(item, quantity) {
  const cart = getCart() ?? []
  const newItem = { ...item, quantity }
  const updatedCart = [...cart, newItem]
  saveCart(updatedCart)
}

export function removeFromCart(item) {
  const cart = getCart() || []
  const updatedCart = cart.filter(
    cartItem => cartItem.codigoArticulo !== item.codigoArticulo
  )
  saveCart(updatedCart)
}

export function emptyCart() {
  clearCart()
}

export function getTotalPrice() {
  const cart = getCart() || []
  return cart
    .reduce((acc, item) => acc + item.precio * item.quantity, 0)
    .toFixed(2)
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

