import { postBuyOrder } from './api/cart.js'
import { getCart, saveCart, clearCart } from './storage/cart.js'
import { checkLocalStorage } from './storage/profile.js'
import { showToast } from './ui/cart.js'

checkLocalStorage()

export async function checkout() {
  const cart = getCart() || {}
  if (cart.listaDetalle.length === 0) {
    showToast('No hay productos en el carrito.')
    return
  }
  const order = createOrder(cart)
  
  await postBuyOrder('orden-compra', order)
  // clearCart()
  showToast('Compra realizada exitosamente.');
}

export async function sendToDraft(){
  const cart = getCart() || {}
  if (cart.listaDetalle.length === 0) {
    showToast('No hay productos en el carrito.')
    return
  }
  const order = createOrder(cart)
  order.borrador = 1
  await postBuyOrder('orden-compra', order)
  // clearCart()
  showToast('Carrito guardado en borrador exitosamente.')
}

export function addToCart(item) {
  const quantityInputId = `quantity-${item.codigoArticulo}`
  const $quantityInput = document.getElementById(quantityInputId)
  let quantity = $quantityInput.value
  quantity = Number(quantity)

  console.log(item)
  const newItem = createArticle(item, quantity)
  if (quantity > 0) {
    const cart = getCart() 
    const index = cart.listaDetalle.findIndex(i => i.codigoArticulo === item.codigoArticulo)

    if (index === -1) {
      addProductToCart(newItem)
    } else {
      updateQuantity(newItem, quantity)
    }

    showToast('Objeto añadido correctamente.', '../pages/cart.html')
  } else {
    alert('La cantidad debe ser mayor a 0')
  }
}

function addProductToCart(item) {
  const cart = getCart()
  const newItem = { ...item }
  const updatedCart = {listaDetalle: [...cart.listaDetalle, newItem]}
  saveCart(updatedCart)
}

export function removeFromCart(item) {
  const cart = getCart()
  const index = cart.listaDetalle.findIndex(i => i.codigoArticulo === item.codigoArticulo)
  cart.listaDetalle.splice(index, 1)

  const updatedCart = {listaDetalle: [...cart.listaDetalle]}
  saveCart(updatedCart)
}

export function emptyCart() {
  clearCart()
}

export function getDiscount(percentage, price) {
  return (price * percentage) / 100
}

export function getTotalQuantity() {
  const cart = getCart()
  const totalQuantity = cart.listaDetalle.reduce((acc, item) => acc + Number(item.cantidad), 0)
  cart.totalItems = totalQuantity
  saveCart(cart)
  return Number(totalQuantity)
}

export function getTotalPrice() {
  const cart = getCart()
  const totalPrice = cart.listaDetalle
    .reduce((acc, item) => acc + (item.precioConDescuento || item.precio) * Number(item.cantidad), 0)
    .toFixed(2)
  cart.totalPesos = Number(totalPrice)
  saveCart(cart)
  return Number(totalPrice)
}

export function updateCart(item, quantity, discount, callback = () => {}) {
  updateQuantity(item, quantity)
  updateDiscount(item, discount)
  callback(getCart())
}

export function updateQuantity(item, quantity) {
  const cart = getCart()
  const index = cart.listaDetalle.findIndex(i => i.codigoArticulo === item.codigoArticulo)
  cart.listaDetalle[index].cantidad = Number(quantity)
  saveCart(cart)
}

export function calculateDiscount(discount, total) {
  if (discount === 0) return total
  const totalPrice = total - (total * discount) / 100
  return Number(totalPrice.toFixed(2)) 
}

export function calculateDelivery(total, delivery) {
  if (delivery < 0) return total
  return total + delivery
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
  const index = cart.listaDetalle.findIndex(i => i.codigoArticulo === item.codigoArticulo)
  const listaDetalle = cart.listaDetalle[index]
  const porcentajeDescuento = Number(discount)
  listaDetalle.porcentajeDescuento = porcentajeDescuento 
  listaDetalle.precioConDescuento = calculateDiscount(
    porcentajeDescuento,
    listaDetalle.precio
  )
  listaDetalle.descripcionDescuento = `${listaDetalle.porcentajeDescuento}%`
  listaDetalle.codigoDescuento = `${listaDetalle.porcentajeDescuento}`
  listaDetalle.importeDescuento = Number((listaDetalle.precioConDescuento * listaDetalle.cantidad).toFixed(2))
  listaDetalle.montoTotal = listaDetalle.importeDescuento
  saveCart(cart)
}

function createArticle(article, quantity) {
  return {
    numeroNota: 0,
    codigoArticulo: article.codigoArticulo,
    descripcionArticulo: article.descripcion,
    precio: article.precio,
    cantidad: Number(quantity),
    cantidadDespachada: 0,
    stockUnidades: article.stockUnidades,
    codigoDescuento: '0',
    descripcionDescuento: '0%',
    porcentajeDescuento: 0,
    importe: article.precio * quantity,
    importeDescuento: article.precio * quantity,
    precioConDescuento: article.precio,
    montoTotal: article.precio * quantity,
    numeroOrden: 0,
    eliminado: false,
    imagenesUrl: []
  }
}

function createOrder(cart) {
  return {
    numeroNota: 0,
    codigoCliente: 1,
    codigoCondicionVenta: 1,
    observaciones: 'string',
    origenPedido: 0,
    estado: 'string',
    totalPesos: getTotalPrice(),
    totalItems: getTotalQuantity(),
    codigoVendedor: 1, 
    fechaNota: new Date().toISOString(),
    borrador: 0,
    idFlete: 1,
    descripcionFlete: 'string',
    listaDetalle: cart.listaDetalle
  }
}
