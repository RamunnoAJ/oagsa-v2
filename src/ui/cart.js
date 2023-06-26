import { getClientsFromSeller } from '../api/profileClientList.js'
import { checkout, emptyCart, removeFromCart, getTotalPrice, updateCart, getTotalQuantity, sendToDraft } from '../cart.js'
import { getCart, getDrafts, removeFromDraft, saveCart } from '../storage/cart.js'
import { getStorageID } from '../storage/profileClientAccount.js'
import { sortClients } from '../utils/sortClients.js'

const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2011%20-%20HERRAMIENTA.png?alt=media&token=b06bbe3a-cd7e-4a80-a4e7-3bccb9a8df33'

export function showToast(message, url = '') {
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
    onClick: () => {
      if (url) {
        window.location.replace = url
      }
    }
  }).showToast()
}

if (window.location.href.includes('cart')) {
  const cart = getCart() || {}
  renderCart(cart)
}

async function renderCart(cart) {
  const $cart = document.getElementById('cart')
  $cart.innerHTML = ''

  await renderClients()

  cart.listaDetalle.forEach(item => {
    const $article = createProductCard(item)
    $cart.appendChild($article)
  })

  renderObservations()
  renderTotalRow()
  renderButtons()
}

async function renderClients(){
  const $cart = document.getElementById('cart')
  const $clients = document.createElement('div')
  $clients.classList.add('cart__clients')

  const $clientsLabel = document.createElement('label')
  $clientsLabel.textContent = 'Buscar cliente: '
  $clientsLabel.classList.add('cart__clients-label')
  $clients.appendChild($clientsLabel)

  const $clientsSelect = document.createElement('select')
  $clientsSelect.name = 'selectedClient'
  $clientsSelect.id = 'selectClient'
  $clientsSelect.classList.add('cart__clients-select')
  $clients.appendChild($clientsSelect)

  const sellerID = await getStorageID()
  const clients = await getClientsFromSeller(sellerID)

  $cart.appendChild($clients)
}

function renderOptions(clients) {
  const $selectClient = document.querySelector('#selectClient') 
  console.log($selectClient)
  sortClients(clients)

  clients.forEach(client => {
    const option = document.createElement('option')
    option.value = client.codigoCliente
    option.textContent = `${client.codigoCliente} - ${client.razonSocial}`

    $selectClient.appendChild(option)
  })
}

function renderObservations() {
  const cart = getCart()
  const $cart = document.getElementById('cart')
  const $observations = document.createElement('textarea')
  $observations.classList.add('observations')
  $observations.id = 'observations'  
  $observations.placeholder = 'Observaciones'
  $observations.value = cart.observaciones || ''
  $observations.addEventListener('change', () => {
    saveCart( { ...getCart(), observaciones: $observations.value } )
  })
  $cart.appendChild($observations)
}

function renderButtons() {
  const $cart = document.getElementById('cart')

  const $container = document.createElement('div')
  $container.className = 'buttons mt-4'
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
    sendToDraft()
    renderCart(getCart())
  })

  const $checkoutButton = document.createElement('button')
  $checkoutButton.textContent = 'Finalizar compra'
  $checkoutButton.addEventListener('click', () => {
    checkout()
  })

  const $draftsButton = document.createElement('button')
  $draftsButton.textContent = 'Borradores'
  $draftsButton.addEventListener('click', () => {
    renderDraftsList()
  })

  $container.appendChild($emptyCartButton)
  $container.appendChild($sendToDraft)
  $container.appendChild($draftsButton)
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

function createTotalRow() {
  const $row = document.createElement('div')
  $row.className = 'total-row'

  const $total = document.createElement('div')
  $total.textContent = 'Total'

  const $container = document.createElement('div')

  const $price = document.createElement('div')
  $price.className = 'total-row__price'
  const $priceText = document.createElement('span')
  const $priceTotal = document.createElement('span')
  $priceTotal.className = 'fw-semi-bold'
  $priceText.textContent = 'Precio:'
  $priceTotal.textContent = `$${getTotalPrice()}`
  $price.appendChild($priceText)
  $price.appendChild($priceTotal)

  const $items = document.createElement('div')
  $items.className = 'total-row__items'
  const $itemsText = document.createElement('span')
  const $itemsTotal = document.createElement('span')
  $itemsTotal.className = 'fw-semi-bold'
  $itemsText.textContent = 'Items:'
  $itemsTotal.textContent = getTotalQuantity()

  $items.appendChild($itemsText)
  $items.appendChild($itemsTotal)

  $container.appendChild($price)
  $container.appendChild($items)
  $row.appendChild($total)
  $row.appendChild($container)

  return $row
}

function renderTotalRow() {
  const $totalRow = createTotalRow()
  const $cart = document.getElementById('cart')
  $cart.appendChild($totalRow)
}

function createProductCard(item) {
  const $card = document.createElement('div')
  $card.classList.add('cart__card')

  const $image = document.createElement('img')
  if (item.imagenesUrl[0]){
    $image.src = `https://www.${item.imagenesUrl[0]}`
  } else {
    $image.src = defaultImage
  }
  $image.alt = item.descripcionArticulo

  const $info = document.createElement('div')
  $info.classList.add('cart__info')

  const $title = document.createElement('h3')
  $title.classList.add('fw-bold')
  $title.textContent = item.descripcionArticulo

  const $code = document.createElement('p')
  $code.classList.add('fw-semi-bold')
  $code.textContent = item.codigoArticulo

  const $price = document.createElement('p')
  $price.classList.add('fw-bold')
  $price.textContent = `$${item.precio.toFixed(2)}`

  const $discount = document.createElement('p')
  $discount.className = 'fw-semi-bold cart__discount'

  const $discountText = document.createElement('p')
  $discountText.textContent = 'Descuento (%): '

  const $discountInput = document.createElement('input')
  $discountInput.value = item.porcentajeDescuento
  $discountInput.type = 'number'
  $discountInput.min = 0
  $discountInput.max = 100
  $discountInput.addEventListener('change', () => {
    updateCart(item, $quantityInput.value, $discountInput.value, renderCart)
  })

  $discount.appendChild($discountText)
  $discount.appendChild($discountInput)

  const $quantity = document.createElement('p')
  $quantity.classList.add('quantity')
  $quantity.classList.add('fw-bold')

  const $quantityInput = document.createElement('input')
  $quantityInput.type = 'number'
  $quantityInput.min = 0
  $quantityInput.max = item.stockUnidades
  $quantityInput.value = item.cantidad
  $quantityInput.addEventListener('change', () => {
    if ( $quantityInput.value <= item.stockUnidades ) {
      updateCart(item, $quantityInput.value, $discountInput.value, renderCart)
    } else {
      alert('Cantidad no válida. Stock disponible: ' + item.stockUnidades)
        $quantityInput.value = item.stockUnidades
    }
  })

  const $removeQuantity = document.createElement('button')
    $removeQuantity.textContent = '-'
    $removeQuantity.addEventListener('click', () => {
      $quantityInput.stepDown()
      updateCart(item, $quantityInput.value, $discountInput.value, renderCart)
  })
  $removeQuantity.className = 'quantity__button quantity__button--remove'

  const $addQuantity = document.createElement('button')
  $addQuantity.textContent = '+'
  $addQuantity.addEventListener('click', () => {
    $quantityInput.stepUp()
    updateCart(item, $quantityInput.value, $discountInput.value, renderCart)
  })
  $addQuantity.className = 'quantity__button quantity__button--add'

  $quantity.appendChild($removeQuantity)
  $quantity.appendChild($quantityInput)
  $quantity.appendChild($addQuantity)

  const $totalArticle = document.createElement('p')
  $totalArticle.className = 'total__article fw-bold'
  $totalArticle.textContent = `$${item.montoTotal.toFixed(2)}`

  const $delete = document.createElement('button')
  $delete.innerHTML = `<i class="fa fa-trash-alt"></i>`
  $delete.addEventListener('click', (e) => {
    e.preventDefault()
    removeFromCart(item)
    renderCart(getCart())

    showToast('Artículo eliminado del carrito')
  })
  $delete.className = 'cart__delete'

  $info.appendChild($title)
  $info.appendChild($code)
  $info.appendChild($price)
  $info.appendChild($discount)
  $info.appendChild($quantity)

  $card.appendChild($image)
  $card.appendChild($info)
  $card.appendChild($totalArticle)
  $card.appendChild($delete)

  return $card
}
