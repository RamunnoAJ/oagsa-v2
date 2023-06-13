import { emptyCart, getTotalPrice, removeFromCart } from '../cart.js'
import { getCart } from '../storage/cart.js'

export function showToast(message) {
  // eslint-disable-next-line no-undef
  Toastify({
    text: message,
    duration: 3000,
    close: false,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: 'linear-gradient(to right, #ffd37c, #ff9c35)',
      color: '#000000',
    },
  }).showToast()
}

if (window.location.href.includes('cart')) {
  const cart = getCart() || []
  renderCart(cart)
}

function renderCart(cart) {
  const $cart = document.getElementById('cart')
  const $table = createTable()
  $cart.innerHTML = ''

  cart.forEach(item => {
    const $row = createProductRow(item)
    $table.appendChild($row)
  })

  $cart.appendChild($table)
  $cart.appendChild(createTotalAmount())

  renderEmptyCart()
}

function renderEmptyCart() {
  const $cart = document.getElementById('cart')

  const $emptyCartButton = document.createElement('button')
  $emptyCartButton.textContent = 'Vaciar carrito'
  $emptyCartButton.addEventListener('click', () => {
    emptyCart()
    renderCart(getCart())
  })

  $cart.appendChild($emptyCartButton)
}

function createTotalAmount() {
  const $totalAmount = document.createElement('div')
  $totalAmount.classList.add('total-amount')
  $totalAmount.textContent = `$${getTotalPrice()}`
  return $totalAmount
}

function createTable() {
  const $table = document.createElement('table')
  $table.classList.add('cart__table')

  const $head = document.createElement('thead')
  const $row = document.createElement('tr')
  const $article = document.createElement('th')
  const $description = document.createElement('th')
  const $price = document.createElement('th')
  const $quantity = document.createElement('th')
  const $total = document.createElement('th')
  const $delete = document.createElement('th')
  $article.textContent = 'Artículo'
  $description.textContent = 'Descripción'
  $price.textContent = 'Precio'
  $quantity.textContent = 'Cantidad'
  $total.textContent = 'Total'
  $row.appendChild($article)
  $row.appendChild($description)
  $row.appendChild($price)
  $row.appendChild($quantity)
  $row.appendChild($total)
  $row.appendChild($delete)
  $head.appendChild($row)
  $table.appendChild($head)

  return $table
}

function createProductRow(item) {
  const $row = document.createElement('tr')
  const $article = document.createElement('td')
  const $description = document.createElement('td')
  const $price = document.createElement('td')
  const $quantity = document.createElement('td')
  const $total = document.createElement('td')
  const $delete = document.createElement('td')
  $article.textContent = item.codigoArticulo
  $description.textContent = item.descripcion
  $price.textContent = `$${item.precio}`
  $quantity.textContent = item.quantity
  $total.textContent = `$${item.precio * item.quantity}`
  $delete.textContent = '✕'
  $row.appendChild($article)
  $row.appendChild($description)
  $row.appendChild($price)
  $row.appendChild($quantity)
  $row.appendChild($total)
  $row.appendChild($delete)

  $delete.addEventListener('click', () => {
    removeFromCart(item)
    renderCart(getCart())

    showToast('Objeto eliminado correctamente.')
  })

  return $row
}
