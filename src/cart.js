import { postBuyOrder } from './api/cart.js'
import { removeDraft } from './api/profileDrafts.js'
import { getCart, saveCart, clearCart } from './storage/cart.js'
import { checkLocalStorage } from './storage/profile.js'
import { getUserFromStorage } from './storage/storageData.js'
import { renderCart, showToast } from './ui/cart.js'
import { navigateToDashboard } from './ui/login.js'

checkLocalStorage()

function validateCart(cart) {
  const errors = []
  if (!cart.codigoCliente) {
    const error = 'Debe seleccionar un cliente.'
    errors.push(error)
  }

  if (!cart.idFlete) {
    const error = 'Debe seleccionar un flete.'
    errors.push(error)
  }

  if (cart.listaDetalle.length === 0) {
    const error = 'No hay productos en el carrito.'
    errors.push(error)
  }

  if (!cart.codigoCondicionVenta) {
    const error = 'Debe seleccionar una condicion de venta.'
    errors.push(error)
  }

  if (errors.length > 0) {
    errors.forEach(error => showToast(error))
  }

  return errors
}

export async function checkout(cart) {
  const errors = validateCart(cart)
  if (errors.length > 0) {
    return
  }

  const order = createOrder(cart)
  if (order.borrador === 1) {
    removeDraft(order.numeroNota)
    order.borrador = 0
  }

  order.numeroNota = 0
  await postBuyOrder('orden-compra', order)
  await emptyCart()
  showToast('Compra realizada exitosamente.')
  renderCart(cart)
  window.location.replace('../pages/store.html')
}

export async function sendToDraft(cart) {
  const errors = validateCart(cart)
  if (errors.length > 0) {
    return
  }

  const order = createOrder(cart)
  order.borrador = 1
  saveCart(order)
  await postBuyOrder('orden-compra', order)
  emptyCart()
  showToast('Carrito guardado en borrador exitosamente.')

  setTimeout(() => {
    navigateToDashboard()
  }, 2000)
}

export function addToCart(item) {
  const quantityInputId = `quantity-${item.codigoArticulo}`
  const $quantityInput = document.getElementById(quantityInputId)
  let quantity = $quantityInput.value
  quantity = Number(quantity)
  const numeroNota = getCart().numeroNota
  if (numeroNota) {
    item.numeroNota = numeroNota
  }

  const newItem = createArticle(item, quantity)
  if (quantity > 0) {
    const cart = getCart()
    const index = cart.listaDetalle.findIndex(
      i => i.codigoArticulo === item.codigoArticulo
    )

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
    alert('La cantidad debe ser mayor a 0')
  }
}

function addProductToCart(item) {
  const cart = getCart()
  const newItem = { ...item }
  const updatedCart = { ...cart, listaDetalle: [...cart.listaDetalle, newItem] }
  saveCart(updatedCart)
}

export function removeFromCart(item) {
  const cart = getCart()
  const index = cart.listaDetalle.findIndex(
    i => i.codigoArticulo === item.codigoArticulo
  )
  cart.listaDetalle.splice(index, 1)

  const updatedCart = { ...cart, listaDetalle: [...cart.listaDetalle] }
  saveCart(updatedCart)
}

export async function emptyCart() {
  clearCart()
}

export function getDiscount(percentage, price) {
  return (price * percentage) / 100
}

export function getTotalQuantity(cart) {
  const totalQuantity = cart.listaDetalle.reduce(
    (acc, item) => acc + Number(item.cantidadPedida),
    0
  )
  cart.totalItems = totalQuantity
  saveCart(cart)
  return Number(totalQuantity)
}

export function getTotalPrice(cart) {
  const totalPrice = cart.listaDetalle.reduce(
    (acc, item) =>
      acc +
      (item.precioConDescuento || item.precio) * Number(item.cantidadPedida),
    0
  )
  cart.totalPesos = Math.round(Number(totalPrice))
  saveCart(cart)
  return Math.round(Number(totalPrice))
}

export function updateCart(item, quantity, discount, callback = () => {}) {
  updateQuantity(item, quantity)
  updateDiscount(item, discount)
  callback(getCart())
}

export function updateQuantity(item, quantity) {
  const cart = getCart()
  const index = cart.listaDetalle.findIndex(
    i => i.codigoArticulo === item.codigoArticulo
  )
  cart.listaDetalle[index].cantidadPedida = Number(quantity)
  saveCart(cart)
}

export function calculateDiscount(discount, total) {
  if (discount === 0) return total
  const totalPrice = total - (total * discount) / 100
  return Number(totalPrice)
}

export function calculateDelivery(total, delivery) {
  if (delivery < 0) return total
  return total + delivery
}

export function handleClientChange() {
  const $selectClient = document.querySelector('#selectClient')
  const client = $selectClient.value

  const cart = getCart()
  cart.codigoCliente = client
  saveCart(cart)
}

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
  const index = cart.listaDetalle.findIndex(
    i => i.codigoArticulo === item.codigoArticulo
  )
  const listaDetalle = cart.listaDetalle[index]
  const porcentajeDescuento = Number(discount)
  listaDetalle.porcentajeDescuento = porcentajeDescuento
  listaDetalle.precioConDescuento = calculateDiscount(
    porcentajeDescuento,
    listaDetalle.precio
  )
  listaDetalle.descripcionDescuento = `${listaDetalle.porcentajeDescuento}%`
  listaDetalle.codigoDescuento = `${listaDetalle.porcentajeDescuento}`
  listaDetalle.importeDescuento = Number(
    listaDetalle.precioConDescuento * listaDetalle.cantidadPedida
  )
  listaDetalle.montoTotal = listaDetalle.importeDescuento
  saveCart(cart)
}

function createArticle(article, quantity) {
  return {
    numeroNota: article.numeroNota || 0,
    codigoArticulo: article.codigoArticulo,
    descripcionArticulo: article.descripcion,
    precio: article.precio,
    cantidadPedida: Number(quantity),
    cantidadDespachada: article.cantidadDespachada || 0,
    stockUnidades: article.stockUnidades,
    codigoDescuento: article.codigoDescuento || '0',
    descripcionDescuento: article.descripcionDescuento || '0%',
    porcentajeDescuento: article.porcentajeDescuento || 0,
    importe: article.precio * quantity,
    importeDescuento: article.precio * quantity,
    precioConDescuento: article.precio,
    montoTotal: article.precio * quantity,
    numeroOrden: article.numeroOrden || 0,
    eliminado: article.eliminado || false,
    imagenesUrl: [...article.url],
  }
}

function createOrder(cart) {
  return {
    numeroNota: cart.numeroNota || 0,
    codigoCliente: cart.codigoCliente,
    codigoCondicionVenta: cart.codigoCondicionVenta || 0,
    observaciones: cart.observaciones || '',
    origenPedido: 0,
    estado: cart.estado || 'Pendiente',
    totalPesos: getTotalPrice(cart),
    totalItems: getTotalQuantity(cart),
    codigoVendedor: JSON.parse(getUserFromStorage()).id,
    fechaNota: cart.fechaNota || new Date().toISOString(),
    borrador: cart.borrador || 0,
    idFlete: cart.idFlete || '',
    descripcionFlete: cart.descripcionFlete || '',
    listaDetalle: cart.listaDetalle,
  }
}
