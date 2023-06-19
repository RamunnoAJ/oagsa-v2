import { checkout, emptyCart, updateQuantity, getTotalQuantity, getTotalPrice, removeFromCart, updateDiscount, calculateDiscount } from '../cart.js'
import { getCart, saveToDraft, getDrafts, removeFromDraft, saveCart } from '../storage/cart.js'

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
  const cart = getCart() || {}
  renderCart(cart)
}

function renderCart(cart) {
  const $cart = document.getElementById('cart')
  const $table = createTable()
  $cart.innerHTML = ''

  cart.listaDetalle.forEach(item => {
    const $row = createProductRow(item)
    $table.appendChild($row)
  })

  $cart.appendChild($table)
  $table.appendChild(createFinalRow())

  renderObservations()
  renderButtons()
}

function renderObservations() {
  const $cart = document.getElementById('cart')
  const $observations = document.createElement('textarea')
  $observations.classList.add('observations')
  $observations.id = 'observations'  
  $observations.placeholder = 'Observaciones'
  $observations.addEventListener('change', () => {
    saveCart( { ...getCart(), observaciones: $observations.value } )
  })
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
    removeFromDraft(getCart().id)
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
    renderDraftsList()
  })

  $container.appendChild($emptyCartButton)
  $container.appendChild($sendToDraft)
  $container.appendChild($draftsButton)
  $container.appendChild($navigateToStore)
  $container.appendChild($checkoutButton)
}

function renderDraftsList() {
  const drafts = getDrafts()
  const $list = document.createElement('ul')
  $list.classList.add('drafts')
  drafts.forEach((item) => {
    $list.appendChild(createDraftCard(item))
  })
  const $cart = document.getElementById('cart')
  $cart.appendChild($list)
}

function createDraftCard(item) {
  const $card = document.createElement('li')
  $card.classList.add('drafts__card')
  const $button = document.createElement('button')
  $button.textContent = `${item.id}` 
  $button.addEventListener('click', () => {
    saveCart(item)
    renderCart(item)
  })

  $card.appendChild($button)
  return $card
}

function createTable() {
  const $table = document.createElement('table')
  $table.id = 'cart-table'
  $table.classList.add('cart__table')

  const $head = document.createElement('thead')
  const $row = document.createElement('tr')
  const $article = document.createElement('th')
  const $description = document.createElement('th')
  const $price = document.createElement('th')
  const $discount = document.createElement('th')
  const $quantity = document.createElement('th')
  const $total = document.createElement('th')
  const $delete = document.createElement('th')
  $article.textContent = 'Artículo'
  $description.textContent = 'Descripción'
  $price.textContent = 'Precio'
  $discount.textContent = 'Descuento (%)'
  $quantity.textContent = 'Cantidad'
  $total.textContent = 'Total'
  $row.appendChild($article)
  $row.appendChild($description)
  $row.appendChild($price)
  $row.appendChild($discount)
  $row.appendChild($quantity)
  $row.appendChild($total)
  $row.appendChild($delete)
  $head.appendChild($row)
  $table.appendChild($head)

  return $table
}

function createFinalRow() {
  const $row = document.createElement('tr')
  const $total = document.createElement('td')
  $total.textContent = 'Total: '
  $row.appendChild($total)
  for (let i = 0; i < 6; i++) {
    const $newRow = document.createElement('td')
    if (i === 3) {
      $newRow.textContent = getTotalQuantity()
    }
    if (i === 4) {
      $newRow.textContent = `$${getTotalPrice()}`
    }
    $row.appendChild($newRow)
  }
  return $row
}

function createProductRow(item) {
  console.log(item)
  const $row = document.createElement('tr')
  const $article = document.createElement('td')
  const $description = document.createElement('td')
  const $price = document.createElement('td')
  const $discount = document.createElement('td')

  const $discountInput = document.createElement('input')
  $discountInput.value = item.porcentajeDescuento
  $discountInput.type = 'number'
  $discountInput.min = 0
  $discountInput.max = 100
  $discountInput.value = item.porcentajeDescuento
  $discountInput.addEventListener('change', () => {
    updateDiscount(item, $discountInput.value)
    renderCart(getCart())
  })
  $discount.appendChild($discountInput)
  const $quantity = document.createElement('td')
  const $quantityInput = document.createElement('input')
  $quantityInput.type = 'number'
  $quantityInput.min = 0
  $quantityInput.max = item.stockUnidades
  $quantityInput.value = item.cantidad
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
  $description.textContent = item.descripcionArticulo
  $price.textContent = `$${item.precio.toFixed(2)}`
  $total.textContent = `$${(calculateDiscount(item.porcentajeDescuento, item.precio) * $quantityInput.value).toFixed(2)}`
  $delete.textContent = '✕'
  $row.appendChild($article)
  $row.appendChild($description)
  $row.appendChild($price)
  $row.appendChild($discount)
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
