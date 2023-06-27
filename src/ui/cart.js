import { getClients } from '../api/cart.js'
import { checkout, removeFromCart, getTotalPrice, updateCart, getTotalQuantity, sendToDraft } from '../cart.js'
import { getCart, saveCart } from '../storage/cart.js'
import { getUserFromStorage } from '../storage/storageData.js'
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
  $cart.innerHTML = '<span class="loader"></span>'

  await renderClients()

  const user = getUserFromStorage()
  const parsedUser = JSON.parse(user)
  const clients = await getClients(parsedUser.id)

  const $loader = document.querySelector('.loader')
  $loader.remove()

  const $cartClients = document.querySelector('.cart__clients')
  $cartClients.classList.remove('visually-hidden')

  renderOptions(clients)

  const $cartContainer = document.createElement('div')
  $cartContainer.classList.add('cart__articles__container')
  $cart.appendChild($cartContainer)

  renderArticles(cart)
}

function renderArticles(cart){
  const $cartContainer = document.querySelector('.cart__articles__container')
  $cartContainer.innerHTML = ''

  cart.listaDetalle.forEach(item => {
    const $article = createProductCard(item)
    $cartContainer.appendChild($article)
  })

  renderObservations()
  renderTotalRow()
  renderFields()
  renderButtons()
}

async function renderClients(){
  const $cart = document.getElementById('cart')
  const $clients = document.createElement('div')
  $clients.classList.add('cart__clients')
  $clients.classList.add('visually-hidden')

  const $clientsLabel = document.createElement('label')
  $clientsLabel.textContent = 'Cliente'
  $clientsLabel.className = 'cart__clients-label uppercase fw-bold'
  $clientsLabel.htmlFor = 'selectClient'
  $clients.appendChild($clientsLabel)

  const $clientsSelect = document.createElement('select')
  $clientsSelect.name = 'selectClient'
  $clientsSelect.id = 'selectClient'
  $clientsSelect.classList.add('cart__clients-select')
  $clients.appendChild($clientsSelect)

  $cart.appendChild($clients)
}

function renderOptions(clients) {
  const $selectClient = document.querySelector('#selectClient') 
  sortClients(clients)

  $selectClient.innerHTML = '<option value="" selected disabled>Seleccione un cliente</option>'

  clients.forEach(client => {
    const option = document.createElement('option')
    option.value = client.codigoCliente
    option.textContent = `${client.codigoCliente} - ${client.razonSocial}`

    $selectClient.appendChild(option)
  })
}

function renderObservations() {
  if (document.querySelector('.observations__container')) {
    const $observations = document.querySelector('.observations__container')
    $observations.remove()
  }

  const cart = getCart()
  const $cart = document.getElementById('cart')

  const $observationsContainer = document.createElement('div')
  $observationsContainer.classList.add('observations__container')

  const $observationsLabel = document.createElement('label')
  $observationsLabel.textContent = 'Observaciones:'
  $observationsLabel.htmlFor = 'observations'
  $observationsLabel.className = ' fw-bold'
  $observationsContainer.appendChild($observationsLabel)

  const $observations = document.createElement('textarea')
  $observations.classList.add('observations')
  $observations.id = 'observations'  
  $observations.value = cart.observaciones || ''
  $observations.addEventListener('change', () => {
    saveCart( { ...getCart(), observaciones: $observations.value } )
  })
  $observationsContainer.appendChild($observations)

  $cart.appendChild($observationsContainer)
}

function renderFields(){
  if (document.querySelector('#fields')) {
    const $fields = document.querySelector('#fields')
    $fields.remove()
  }

  const cart = getCart()
  const $cart = document.getElementById('cart')

  const $fieldsContainer = document.createElement('div')
  $fieldsContainer.id = 'fields'
  $fieldsContainer.className = 'fields__container'

  const $fleteContainer = document.createElement('div')
  $fleteContainer.className = 'fields__flete'
  $fieldsContainer.appendChild($fleteContainer)

  const $fleteLabel = document.createElement('label')
  $fleteLabel.textContent = 'Flete:'
  $fleteLabel.htmlFor = 'flete'
  $fleteLabel.className = 'fw-semi-bold'
  $fieldsContainer.appendChild($fleteLabel)

  const $flete = document.createElement('select')
  $flete.name = 'flete'
  $flete.id = 'flete'
  $flete.classList.add('fields__select')
  $fieldsContainer.appendChild($flete)


  const $condicionVentaContainer = document.createElement('div')
  $condicionVentaContainer.className = 'fields__condicion-venta'
  $fieldsContainer.appendChild($condicionVentaContainer) 

  $cart.appendChild($fieldsContainer)
}

function renderButtons() {
  if (document.querySelector('#buttons')) {
    const $buttons = document.querySelector('#buttons')
    $buttons.remove()
  }

  const $cart = document.getElementById('cart')

  const $container = document.createElement('div')
  $container.id = 'buttons'
  $container.className = 'buttons mt-4'
  $cart.appendChild($container)

  const $buttonsContainer = document.createElement('div')
  $buttonsContainer.className = 'buttons__container mb-2'

  const $addProducts = document.createElement('button')
  $addProducts.className = 'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400'
  $addProducts.textContent = 'Agregar productos'
  $addProducts.addEventListener('click', () => {
    window.location.href = '/pages/store'
  })

  const $sendToDraft = document.createElement('button')
  $sendToDraft.className = 'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400'
  $sendToDraft.textContent = 'Guardar borrador'
  $sendToDraft.addEventListener('click', () => {
    sendToDraft()
    renderCart(getCart())
  })

  const $checkoutButton = document.createElement('button')
  $checkoutButton.className = 'button-cart button-checkout bg-secondary-400 uppercase fw-semi-bold bg-hover-secondary-400 text-white'
  $checkoutButton.textContent = 'Finalizar compra'
  $checkoutButton.addEventListener('click', () => {
    checkout()
  })

  $buttonsContainer.appendChild($addProducts)
  $buttonsContainer.appendChild($sendToDraft)

  $container.appendChild($buttonsContainer)
  $container.appendChild($checkoutButton)
}

function createTotalRow() {
  const $row = document.createElement('div')
  $row.className = 'total-row'

  const $price = document.createElement('div')
  $price.className = 'total-row__price'
  const $priceText = document.createElement('span')
  const $priceTotal = document.createElement('span')
  $priceTotal.className = 'fw-semi-bold'
  $priceText.textContent = 'Precio Final:'
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

  const $hr = document.createElement('hr')
  $hr.className = 'total-row__br mt-2 mb-2'

  $items.appendChild($itemsText)
  $items.appendChild($itemsTotal)

  $row.appendChild($items)
  $row.appendChild($price)
  $row.appendChild($hr)

  return $row
}

function renderTotalRow() {
  if (document.querySelector('.total-row')) {
    const $totalRow = document.querySelector('.total-row')
    $totalRow.remove()
  }

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
    updateCart(item, $quantityInput.value, $discountInput.value, renderArticles)
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
      updateCart(item, $quantityInput.value, $discountInput.value, renderArticles)
    } else {
      alert('Cantidad no válida. Stock disponible: ' + item.stockUnidades)
        $quantityInput.value = item.stockUnidades
    }
  })

  const $removeQuantity = document.createElement('button')
    $removeQuantity.textContent = '-'
    $removeQuantity.addEventListener('click', () => {
      $quantityInput.stepDown()
      updateCart(item, $quantityInput.value, $discountInput.value, renderArticles)
  })
  $removeQuantity.className = 'quantity__button quantity__button--remove'

  const $addQuantity = document.createElement('button')
  $addQuantity.textContent = '+'
  $addQuantity.addEventListener('click', () => {
    $quantityInput.stepUp()
    updateCart(item, $quantityInput.value, $discountInput.value, renderArticles)
  })
  $addQuantity.className = 'quantity__button quantity__button--add'

  $quantity.appendChild($removeQuantity)
  $quantity.appendChild($quantityInput)
  $quantity.appendChild($addQuantity)

  const $container = document.createElement('div')
  $container.classList.add('cart__article__container')

  const $totalArticle = document.createElement('p')
  $totalArticle.className = 'total__article fw-bold'
  $totalArticle.textContent = `$${item.montoTotal.toFixed(2)}`

  const $delete = document.createElement('button')
  $delete.innerHTML = `<i class="fa fa-trash-alt"></i>`
  $delete.addEventListener('click', (e) => {
    e.preventDefault()
    removeFromCart(item)
    renderArticles(getCart())

    showToast('Artículo eliminado del carrito')
  })
  $delete.className = 'cart__delete'

  $container.appendChild($delete)
  $container.appendChild($totalArticle)

  $info.appendChild($title)
  $info.appendChild($code)
  $info.appendChild($price)
  $info.appendChild($discount)
  $info.appendChild($quantity)

  $card.appendChild($image)
  $card.appendChild($info)
  $card.appendChild($container)

  return $card
}
