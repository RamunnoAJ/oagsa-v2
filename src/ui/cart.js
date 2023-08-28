import { getFields } from '../api/cart.js'
import { getClientsFromSeller } from '../api/profileClientList.js'
import { removeDraft } from '../api/profileDrafts.js'
import {
  checkout,
  removeFromCart,
  getTotalPrice,
  updateCart,
  getTotalQuantity,
  sendToDraft,
  emptyCart,
} from '../cart.js'
import { getCart, saveCart } from '../storage/cart.js'
import { getUserFromStorage } from '../storage/storageData.js'
import { triggerSweetAlert } from '../utils/sweetAlert.js'

/** @typedef {import('../entities/articles.js').ArticleOrder} ArticleOrder */

const defaultImage =
  'https://firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2011%20-%20HERRAMIENTA.png?alt=media&token=b06bbe3a-cd7e-4a80-a4e7-3bccb9a8df33'

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
        window.location.replace(url)
      }
    },
  }).showToast()
}

if (window.location.href.includes('cart')) {
  const cart = getCart() || {}
  renderCart(cart)
}

export async function renderCart(cart) {
  if (cart.draft === 1) {
    if (document.querySelector('.cart__title span')) {
      const cartDraft = document.querySelector('.cart__title span')
      cartDraft.remove()
    }
    const $cartTitle = document.querySelector('.cart__title')
    const $cartDraft = document.createElement('span')
    $cartDraft.classList.add('ml-2')
    $cartDraft.style = 'font-size: 10px;'
    $cartDraft.textContent = '(Borrador)'

    $cartTitle.appendChild($cartDraft)
  } else {
    if (document.querySelector('.cart__title span')) {
      const cartDraft = document.querySelector('.cart__title span')
      cartDraft.remove()
    }
  }

  const $cart = document.getElementById('cart')
  $cart.innerHTML = '<span class="loader"></span>'

  await renderClients(cart)

  const user = getUserFromStorage()
  const parsedUser = JSON.parse(user)
  const clients = await getClientsFromSeller(parsedUser.id)

  const $loader = document.querySelector('.loader')
  $loader.remove()

  const $cartClients = document.querySelector('.cart__clients')
  $cartClients.classList.remove('visually-hidden')

  renderOptions(clients, '#selectClient')

  const $cartContainer = document.createElement('div')
  $cartContainer.classList.add('cart__articles__container')
  $cart.appendChild($cartContainer)

  await renderArticles(cart)
}

async function renderArticles(cart) {
  const $cartContainer = document.querySelector('.cart__articles__container')
  $cartContainer.innerHTML = ''

  cart.detail.forEach(item => {
    const $article = createProductCard(item)
    $cartContainer.appendChild($article)
  })

  await renderContainer()
  renderButtons(cart)
}

async function renderContainer() {
  if (document.querySelector('#buttons')) {
    const $buttons = document.querySelector('#buttons')
    $buttons.remove()
  }

  if (document.querySelector('.container__fluid')) {
    const $containerFluid = document.querySelector('.container__fluid')
    $containerFluid.remove()
  }

  const $cart = document.getElementById('cart')
  const $container = document.createElement('div')
  $container.classList.add('container__fluid')

  $cart.appendChild($container)

  renderObservations()
  renderTotalRow()
  await renderFields()
}

async function renderClients(cart) {
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
  $clientsSelect.select = cart.idClient
  if (cart.borrador === 1) $clientsSelect.disabled = true

  $clientsSelect.addEventListener('change', () => {
    saveCart({ ...getCart(), idClient: Number($clientsSelect.value) })
  })

  $clients.appendChild($clientsSelect)
  $cart.appendChild($clients)
}

function renderOptions(options, select) {
  const cart = getCart()
  const $select = document.querySelector(select)

  let value
  let textContent
  let sortedOptions

  switch (select) {
    case '#selectClient':
      $select.innerHTML =
        '<option value="" selected disabled>Seleccione un cliente</option>'
      value = 'id'
      textContent = 'name'
      sortedOptions = options.sort(function (a, b) {
        return a[textContent] > b[textContent] ? 1 : -1
      })
      break

    case '#flete':
      $select.innerHTML =
        '<option value="" selected disabled>Seleccione...</option>'
      value = 'id'
      textContent = 'description'
      sortedOptions = options.sort(function (a, b) {
        return a[value] > b[value] ? 1 : -1
      })
      break

    case '#condicionVenta':
      $select.innerHTML =
        '<option value="" selected disabled>Seleccione...</option>'
      value = 'id'
      textContent = 'description'
      sortedOptions = options.sort(function (a, b) {
        return a[value] > b[value] ? 1 : -1
      })
      break
    default:
      throw new Error(`El select ${select} no existe`)
  }

  sortedOptions.forEach(option => {
    const $option = document.createElement('option')
    $option.value = option[value]
    if (value === 'id') {
      $option.textContent = `${option[textContent]} - ${option[value]}`
      if ($option.value === cart.idClient?.toString()) {
        $option.selected = true
      } else if ($option.value === cart.idSellCondition.toString()) {
        $option.textContent = `${option[textContent]}`
        $option.selected = true
      } else if ($option.value === cart.idFreight.toString()) {
        $option.textContent = `${option[textContent]}`
        $option.selected = true
      }
    } else {
      $option.textContent = option[textContent]
    }

    $select.appendChild($option)
  })
}

function renderObservations() {
  if (document.querySelector('.observations__container')) {
    const $observations = document.querySelector('.observations__container')
    $observations.remove()
  }

  const cart = getCart()
  const $cart = document.querySelector('.container__fluid')

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
  $observations.value = cart.observations || ''
  $observations.addEventListener('change', () => {
    saveCart({ ...getCart(), observations: $observations.value })
  })
  $observationsContainer.appendChild($observations)

  $cart.appendChild($observationsContainer)
}

async function renderFields() {
  if (document.querySelector('#buttons')) {
    const $buttons = document.querySelector('#buttons')
    $buttons.remove()
  }

  if (document.querySelector('#fields')) {
    const $fields = document.querySelector('#fields')
    $fields.remove()
  }

  const $cart = document.querySelector('.container__fluid')

  const $fieldsContainer = document.createElement('div')
  $fieldsContainer.id = 'fields'
  $fieldsContainer.className = 'fields__container'

  const $fleteContainer = document.createElement('div')
  $fleteContainer.className = 'fields'

  const $fleteLabel = document.createElement('label')
  $fleteLabel.textContent = 'Flete:'
  $fleteLabel.htmlFor = 'flete'
  $fleteLabel.className = 'fw-semi-bold'
  $fleteContainer.appendChild($fleteLabel)

  const fletes = await getFields('orden-compra/flete')
  const $flete = document.createElement('select')
  $flete.name = 'flete'
  $flete.id = 'flete'
  $flete.classList.add('fields__select')
  $flete.addEventListener('change', () => {
    saveCart({
      ...getCart(),
      idFreight: $flete.value,
      freight: $flete.options[$flete.selectedIndex].text,
    })
  })
  $fleteContainer.appendChild($flete)

  const condicionVenta = await getFields('orden-compra/condicionventa')
  const $condicionVentaContainer = document.createElement('div')
  $condicionVentaContainer.className = 'fields'

  const $condicionVentaLabel = document.createElement('label')
  $condicionVentaLabel.textContent = 'Condición de venta:'
  $condicionVentaLabel.htmlFor = 'condicionVenta'
  $condicionVentaLabel.className = 'fw-semi-bold'
  $condicionVentaContainer.appendChild($condicionVentaLabel)

  const $condicionVenta = document.createElement('select')
  $condicionVenta.name = 'condicionVenta'
  $condicionVenta.id = 'condicionVenta'
  $condicionVenta.classList.add('fields__select')
  $condicionVenta.addEventListener('change', () => {
    saveCart({
      ...getCart(),
      idSellCondition: Number($condicionVenta.value),
    })
  })
  $condicionVentaContainer.appendChild($condicionVenta)

  $fieldsContainer.appendChild($fleteContainer)
  $fieldsContainer.appendChild($condicionVentaContainer)

  $cart.appendChild($fieldsContainer)
  renderOptions(fletes, '#flete')
  renderOptions(condicionVenta, '#condicionVenta')
}

function renderButtons(cart) {
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
  $addProducts.className =
    'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400'
  $addProducts.type = 'button'
  $addProducts.textContent = 'Agregar productos'
  $addProducts.addEventListener('click', () => {
    window.location.href = '/pages/store.html'
  })
  $buttonsContainer.appendChild($addProducts)

  if (cart.draft === 1) {
    const $deleteDraft = document.createElement('button')
    $deleteDraft.className =
      'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400'
    $deleteDraft.type = 'button'
    $deleteDraft.textContent = 'Eliminar borrador'
    $buttonsContainer.appendChild($deleteDraft)

    $deleteDraft.addEventListener('click', () => {
      try {
        triggerSweetAlert(
          'Desea eliminar el borrador?',
          'Esta acción no es reversible',
          'Eliminar',
          'Eliminado!',
          'El borrador ha sido eliminado.',
          async () => {
            await removeDraft(cart.id)
            emptyCart()
            renderCart(getCart())
          }
        )
      } catch (error) {
        Toastify({
          text: error.message,
          duration: 3000,
          close: false,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
          style: {
            background: 'linear-gradient(to right, #a25553, #79403e)',
            color: '#000000',
          },
        }).showToast()
      }
    })
  }

  const $sendToDraft = document.createElement('button')
  $sendToDraft.className =
    'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400'
  $sendToDraft.textContent = 'Guardar borrador'
  if (cart.draft === 1) {
    $sendToDraft.textContent = 'Guardar cambios'
  }
  $sendToDraft.type = 'button'
  $sendToDraft.addEventListener('click', async () => {
    await sendToDraft(getCart())
  })

  if (cart.draft === 1) {
    $sendToDraft.classList.add('span-2')
  }
  $buttonsContainer.appendChild($sendToDraft)

  const $checkoutButton = document.createElement('button')
  $checkoutButton.className =
    'button-cart button-checkout bg-secondary-400 uppercase fw-semi-bold bg-hover-secondary-400 text-white'
  $checkoutButton.textContent = 'Finalizar compra'
  $checkoutButton.type = 'submit'
  $checkoutButton.addEventListener('click', e => {
    e.preventDefault()
    checkout(getCart())
  })

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
  $priceTotal.textContent = `$${getTotalPrice(getCart())}`
  $price.appendChild($priceText)
  $price.appendChild($priceTotal)

  const $items = document.createElement('div')
  $items.className = 'total-row__items'
  const $itemsText = document.createElement('span')
  const $itemsTotal = document.createElement('span')
  $itemsTotal.className = 'fw-semi-bold'
  $itemsText.textContent = 'Items:'
  $itemsTotal.textContent = getTotalQuantity(getCart())

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
  const $cart = document.querySelector('.container__fluid')
  $cart.appendChild($totalRow)
}

/**
 * @param {ArticleOrder} item
 * @returns {HTMLDivElement}
 * */
function createProductCard(item) {
  const $card = document.createElement('div')
  $card.classList.add('cart__card')

  const $image = document.createElement('img')
  if (item.images[0]) {
    if (item.images[0].includes('G:\\FerozoWebHosting')) {
      const source = item.images[0]
        .split('\\')
        .slice(2)
        .filter(item => {
          return item !== 'public_html'
        })
        .join('\\')
      $image.src = `https://www.${source}`
    } else {
      $image.src = `https://www.${item.images[0]}`
    }
  } else {
    $image.src = defaultImage
  }
  $image.alt = item.name

  const $info = document.createElement('div')
  $info.classList.add('cart__info')

  const $title = document.createElement('h3')
  $title.classList.add('fw-bold')
  $title.textContent = item.name

  const $code = document.createElement('p')
  $code.classList.add('fw-semi-bold')
  $code.textContent = item.id

  const $price = document.createElement('p')
  $price.classList.add('fw-bold')
  $price.textContent = `$${item.price.toFixed(0)}`

  const $discount = document.createElement('p')
  $discount.className = 'fw-semi-bold cart__discount'

  const $discountText = document.createElement('label')
  $discountText.htmlFor = `porcentajeDescuento-${item.id}`
  $discountText.textContent = 'Descuento: '

  const $discountInput = document.createElement('input')
  $discountInput.className = 'ml-1'
  $discountInput.name = `porcentajeDescuento-${item.id}`
  $discountInput.id = `porcentajeDescuento-${item.id}`
  $discountInput.value = item.discountPercentage
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
  $quantityInput.id = `cantidad-${item.id}`
  $quantityInput.type = 'number'
  $quantityInput.min = 1
  $quantityInput.value = item.quantity
  $quantityInput.addEventListener('change', () => {
    updateCart(item, $quantityInput.value, $discountInput.value, renderArticles)
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
  $totalArticle.textContent = `$${item.priceTotal.toFixed(0)}`

  const $delete = document.createElement('button')
  $delete.innerHTML = `<i class="fa fa-trash-alt"></i>`
  $delete.addEventListener('click', e => {
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
