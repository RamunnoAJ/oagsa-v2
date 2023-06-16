import { checkout, emptyCart, updateQuantity, getTotalPrice, removeFromCart } from '../cart.js'
import { getCart, saveCart, saveToDraft, getDrafts, getDraftCart, removeFromDraft } from '../storage/cart.js'

export function showToast(message) {
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

  renderObservations()
  renderButtons()
}

function renderObservations() {
  const $cart = document.getElementById('cart')
  const $observations = document.createElement('textarea')
  $observations.classList.add('observations')
  $observations.id = 'observations'  
  $observations.placeholder = 'Observaciones'
  $cart.appendChild($observations)
}


function renderButtons() {
  const $cart = document.getElementById('cart')

  const $container = document.createElement('div')
  $container.classList.add('buttons')
  $cart.appendChild($container)

  const $emptyCartButton = document.createElement('button')
  $emptyCartButton.textContent = 'Eliminar borrador'
  $emptyCartButton.addEventListener('click', () => {
    removeFromDraft(getCart())
    emptyCart()
    renderCart(getCart())
  })

  const $sendToDraft = document.createElement('button')
  $sendToDraft.textContent = 'Enviar a borrador'
  $sendToDraft.addEventListener('click', () => {
    saveToDraft(getCart())
    renderCart(getCart())
  })

  const $checkoutButton = document.createElement('button')
  $checkoutButton.textContent = 'Finalizar compra'
  $checkoutButton.addEventListener('click', () => {
    checkout()
  })

  const $navigateToStore = document.createElement('button')
  $navigateToStore.textContent = 'Volver a la tienda'
  $navigateToStore.addEventListener('click', () => {
    window.location.href = '/pages/store.html'
  })

  const $draftsButton = document.createElement('button')
  $draftsButton.textContent = 'Borradores'
  $draftsButton.addEventListener('click', () => {
    // render a list with all the carts on drafts
    renderDraftsList()
  })

  $container.appendChild($emptyCartButton)
  $container.appendChild($sendToDraft)
  $container.appendChild($draftsButton)
  $container.appendChild($navigateToStore)
  $container.appendChild($checkoutButton)
}

function renderDraftsList() {
  // render a list with all the carts on drafts
  const drafts = getDrafts()
  console.log(drafts)

  const $list = document.createElement('ul')
  $list.classList.add('drafts')
  drafts.forEach((item, i) => {
    const $li = document.createElement('li')
    $li.textContent = i + 1
    $li.addEventListener('click', () => {
      saveCart(getDraftCart(i))
      renderCart(getCart())
    })
    $list.appendChild($li)
  })

  const $cart = document.getElementById('cart')
  $cart.appendChild($list)
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
  const $quantityInput = document.createElement('input')
  $quantityInput.type = 'number'
    $quantityInput.min = 0
    $quantityInput.max = item.stockUnidades
  $quantityInput.value = item.quantity
  $quantityInput.addEventListener('change', () => {
    if ( $quantityInput.value <= item.stockUnidades ) {
      updateQuantity(item, $quantityInput.value)
    renderCart(getCart())
    } else {
      alert('Cantidad no válida. Stock disponible: ' + item.stockUnidades)
        $quantityInput.value = item.stockUnidades
    }
  })

  $quantity.appendChild($quantityInput)

  const $total = document.createElement('td')
  const $delete = document.createElement('td')
  $article.textContent = item.codigoArticulo
  $description.textContent = item.descripcion
  $price.textContent = `$${item.precio.toFixed(2)}`
  $total.textContent = `$${(item.precio * item.quantity).toFixed(2)}`
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
