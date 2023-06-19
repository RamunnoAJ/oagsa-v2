import { getCart, saveCart, clearCart } from './storage/cart.js'
import { checkLocalStorage } from './storage/profile.js'
import { showToast } from './ui/cart.js'

checkLocalStorage()

export function checkout() {
  const cart = getCart() || {}
  console.log(cart)
  if (cart.listaDetalle.length === 0) {
    showToast('No hay productos en el carrito.')
    return
  }
  const order = createOrder(cart)
  console.log(order)

//    clearCart()
  showToast('Compra finalizada.')
}

export function addToCart(item) {
  const quantityInputId = `quantity-${item.codigoArticulo}`
  const $quantityInput = document.getElementById(quantityInputId)
  let quantity = $quantityInput.value
  quantity = Number(quantity)

  const newItem = createArticle(item, quantity)
  console.log(newItem)
  if (quantity > 0) {
    const cart = getCart() 
    const index = cart.listaDetalle.findIndex(i => i.codigoArticulo === item.codigoArticulo)

    if (index === -1) {
      addProductToCart(newItem)
    } else {
      updateQuantity(newItem, quantity)
    }

    showToast('Objeto añadido correctamente.')
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
    .reduce((acc, item) => acc + Number(item.precioConDescuento) * Number(item.cantidad), 0)
    .toFixed(2)
  cart.totalPesos = Number(totalPrice)
  saveCart(cart)
  return totalPrice
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
    codigoDescuento: '',
    descripcionDescuento: '',
    porcentajeDescuento: 0,
    importe: article.precio * quantity,
    importeDescuento: 0,
    precioConDescuento: 0,
    montoTotal: 0,
    numeroOrden: 0,
    eliminado: false,
    imagenesUrl: article.url
  }
}

function createOrder(cart) {
  return {
    numeroNota: 0,
    codigoCliente: cart.codigoCliente || 0,
    codigoCondicionVenta: 0,
    observaciones: cart.observaciones || '',
    origenPedido: 0,
    estado: '',
    totalPesos: getTotalPrice(),
    totalItems: getTotalQuantity(),
    codigoVendedor: cart.codigoVendedor || 0,
    fechaNota: new Date(),
    borrador: 0,
    idFlete: 0,
    descripcionFlete: '',
    listaDetalle: cart.listaDetalle
  }
}
