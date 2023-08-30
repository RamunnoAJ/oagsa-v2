import { postBuyOrder } from './api/cart.js'
import { removeDraft } from './api/profileDrafts.js'
import { getCart, saveCart, clearCart } from './storage/cart.js'
import { checkLocalStorage } from './storage/profile.js'
import { showToast } from './ui/cart.js'
import { navigateToDashboard } from './ui/login.js'

/** @typedef {import('./entities/orders.js').Order} Order
 * @typedef {import('./entities/orders.js').ArticleOrder} ArticleOrder
 * */

checkLocalStorage()

/**
 * @param {Order} cart
 * @returns {string[]}
 * */
function validateCart(cart) {
  const errors = []
  if (!cart.idClient) {
    const error = 'Debe seleccionar un cliente.'
    errors.push(error)
  }

  if (!cart.idFreight) {
    const error = 'Debe seleccionar un flete.'
    errors.push(error)
  }

  if (cart.detail.length === 0) {
    const error = 'No hay productos en el carrito.'
    errors.push(error)
  }

  if (!cart.idSellCondition) {
    const error = 'Debe seleccionar una condicion de venta.'
    errors.push(error)
  }

  if (errors.length > 0) {
    errors.forEach(error => showToast(error))
  }

  return errors
}

/**
 * @param {Order} cart
 * */
export async function checkout(cart) {
  const errors = validateCart(cart)
  if (errors.length > 0) {
    return
  }

  const order = cart
  if (order.draft === 1) {
    removeDraft(order.id)
    order.draft = 0
  }

  order.id = 0
  await postBuyOrder('orden-compra', order)
  await emptyCart()
  showToast('Compra realizada exitosamente.')

  setTimeout(() => {
    navigateToDashboard()
  }, 1500)
}

/**
 * @param {Order} cart
 * */
export async function sendToDraft(cart) {
  const errors = validateCart(cart)
  if (errors.length > 0) {
    return
  }

  const order = cart
  order.draft = 1
  saveCart(order)
  await postBuyOrder('orden-compra', order)
  emptyCart()
  showToast('Carrito guardado en borrador exitosamente.')

  setTimeout(() => {
    navigateToDashboard()
  }, 500)
}

/**
 * @param {ArticleOrder} item
 * */
export function addToCart(item) {
  const quantityInputId = `quantity-${item.id}`
  const $quantityInput = document.getElementById(quantityInputId)
  let quantity = $quantityInput.value
  quantity = Number(quantity)
  const id = getCart().id
  if (id) {
    item.id = id
  }
  item.quantity = quantity

  const newItem = item
  if (quantity > 0) {
    const cart = getCart()
    const index = cart.detail.findIndex(i => i.id === item.id)

    if (index === -1) {
      addProductToCart(newItem)
      showToast('Objeto añadido correctamente.', '../pages/cart.html')
    } else {
      showToast(
        `El producto ya existe en el carrito, se actualizó su cantidad a: ${quantity}`,
        '../pages/cart.html'
      )
      updateQuantity(newItem, quantity)
    }
  } else {
    showToast('La cantidad debe ser mayor a 0')
  }
}

/**
 * @param {ArticleOrder} item
 * */
function addProductToCart(item) {
  const cart = getCart()
  const newItem = { ...item }
  const updatedCart = { ...cart, detail: [...cart.detail, newItem] }
  saveCart(updatedCart)
}

/**
 * @param {ArticleOrder} item
 * */
export function removeFromCart(item) {
  const cart = getCart()
  const index = cart.detail.findIndex(i => i.id === item.id)
  cart.detail.splice(index, 1)

  const updatedCart = { ...cart, detail: [...cart.detail] }
  saveCart(updatedCart)
}

export async function emptyCart() {
  clearCart()
}

/**
 * @param {number} percentage
 * @param {number} price
 * @returns {number}
 * */
export function getDiscount(percentage, price) {
  return (price * percentage) / 100
}

/**
 * @param {Order} cart
 * @returns {number}
 * */
export function getTotalQuantity(cart) {
  const totalQuantity = cart.detail.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  )
  cart.items = totalQuantity
  saveCart(cart)
  return Number(totalQuantity)
}

/**
 * @param {Order} cart
 * @returns {number}
 * */
export function getTotalPrice(cart) {
  const totalPrice = cart.detail.reduce(
    (acc, item) =>
      acc + (item.priceDiscount || item.price) * Number(item.quantity),
    0
  )
  cart.total = Number(totalPrice).toFixed(0)
  saveCart(cart)
  return Number(totalPrice).toFixed(0)
}

/**
 * @param {ArticleOrder} item
 * @param {number} quantity
 * @param {number} discount
 * @param {function} callback
 * */
export function updateCart(item, quantity, discount, callback = () => {}) {
  updateQuantity(item, quantity)
  updateDiscount(item, discount)
  callback(getCart())
}

/**
 * @param {ArticleOrder} item
 * @param {number} quantity
 * */
export function updateQuantity(item, quantity) {
  const cart = getCart()
  const index = cart.detail.findIndex(i => i.id === item.id)
  cart.detail[index].quantity = Number(quantity)
  saveCart(cart)
}

/**
 * @param {number} discount
 * @param {number} total
 * @returns {number}
 * */
export function calculateDiscount(discount, total) {
  if (discount === 0) return total
  const totalPrice = total - (total * discount) / 100
  return Number(totalPrice)
}

export function handleClientChange() {
  const $selectClient = document.querySelector('#selectClient')
  const client = $selectClient.value

  const cart = getCart()
  cart.idClient = client
  saveCart(cart)
}

/**
 * @param {ArticleOrder} item
 * @param {number} discount
 * */
export function updateDiscount(item, discount) {
  if (discount < 0) {
    alert('El descuento debe ser mayor a 0')
    return
  }
  if (discount > 100) {
    alert('El descuento debe ser menor a 100')
    return
  }

  const cart = getCart()
  const index = cart.detail.findIndex(i => i.id === item.id)
  const detail = cart.detail[index]
  const discountPercentage = Number(discount)
  detail.discountPercentage = discountPercentage
  detail.priceDiscount = calculateDiscount(discountPercentage, detail.price)
  detail.discount = `${detail.discountPercentage}%`
  detail.idDiscount = `${detail.discountPercentage}`
  detail.totalDiscount = Number(detail.priceDiscount * detail.quantity)
  detail.priceTotal = detail.totalDiscount
  saveCart(cart)
}
