import { getFields } from '../api/cart.js'
import { getClientsFromSeller } from '../api/profileClientList.js'
import { removeDraft } from '../api/profileDrafts.js'
import { showToast } from '../utils/showToast.js'
import {
  checkout,
  removeFromCart,
  getTotalPrice,
  updateCart,
  getTotalQuantity,
  sendToDraft,
  emptyCart,
  updateOrder,
} from '../cart.js'
import { getCart, saveCart } from '../storage/cart.js'
import { getUserFromStorage } from '../storage/storageData.js'
import { formatter } from '../utils/formatPrice.js'
import { triggerSweetAlert } from '../utils/sweetAlert.js'
import { downloadPDF } from '../utils/downloadPDF.js'
import { navigateToStore } from './login.js'
import { SURPASS_STOCK } from '../consts.js'

/** @typedef {import('../entities/articles.js').ArticleOrder} ArticleOrder */

export const defaultImage =
  'https://firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2011%20-%20HERRAMIENTA.png?alt=media&token=b06bbe3a-cd7e-4a80-a4e7-3bccb9a8df33'

if (window.location.href.includes('cart')) {
  const cart = getCart() || {}
  renderCart(cart)
}

export async function renderCart(cart) {
  const $header = document.querySelector('.cart__header')
  if (cart.draft === 1) {
    if ($header.querySelector('.cart__title span')) {
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
  let clients, isUnique
  if (parsedUser.role !== 3) {
    clients = await getClientsFromSeller(parsedUser.id)
    isUnique = false
  } else {
    clients = [parsedUser]
    isUnique = true
  }

  const $loader = document.querySelector('.loader')
  $loader.remove()

  const $cartClients = document.querySelector('.cart__clients')
  $cartClients.classList.remove('visually-hidden')

  renderOptions(clients, '#selectClient', isUnique)

  const $cartContainer = document.createElement('div')
  $cartContainer.classList.add('cart__articles__container')
  $cartContainer.addEventListener('click', async () => {
    const newCart = getCart()
    saveCart(newCart)
  })
  $cart.appendChild($cartContainer)

  await renderArticles(cart)
  await selectFields(cart)

  if (document.querySelector('.table-container')) {
    document.querySelector('.table-container').remove()
  }

  const $tableContainer = document.createElement('div')
  $tableContainer.className = 'table-container visually-hidden'
  document.querySelector('.cart__container').appendChild($tableContainer)

  const $table = createTable()
  $tableContainer.appendChild($table)

  const $tbody = $table.querySelector('tbody')

  cart.detail.forEach(item => {
    const $row = createTableRow(item)
    $tbody.appendChild($row)
  })

  const $totalRow = createTableTotalRow(cart)
  $tbody.appendChild($totalRow)

  renderButtonDownload()
}

function createTableToDownload() {
  const cart = getCart()

  const $table = document.createElement('table')

  $table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Artículo</th>
        <th scope="col">Código</th>
        <th scope="col">Precio</th>
        <th scope="col">Descuento</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Total</th>
      </tr>
    </thead>
    <tbody>
        ${cart.detail.map(item => createTableRowToDownload(item).outerHTML)}
        <tr>
            <td style="text-align: left;">Total:</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${cart.items}</td>
            <td>${formatter.format(
              cart.total < 0 ? cart.total * -1 : cart.total
            )}</td>
        </tr>
    </tbody>
    `

  return $table
}

function createTableRowToDownload(item) {
  const $row = document.createElement('tr')
  const totalPrice = item.priceTotal

  $row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.id}</td>
    <td>${formatter.format(
      item.price < 0 ? item.price.toFixed(0) * -1 : item.price.toFixed(0)
    )}</td>
    <td>${item.discountPercentage}%</td>
    <td>${item.quantity}</td>
    <td>${formatter.format(
      totalPrice < 0 ? totalPrice * -1 : totalPrice.toFixed(0)
    )}</td>
  `
  return $row
}

async function renderArticles(cart) {
  const $cartContainer = document.querySelector('.cart__articles__container')
  $cartContainer.innerHTML = ''

  cart.detail.forEach(item => {
    if (item.deleted) return
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
  if (cart.draft === 1) $clientsSelect.disabled = true

  $clientsSelect.addEventListener('change', () => {
    const clientName =
      $clientsSelect.options[$clientsSelect.selectedIndex].text.split(' - ')[0]
    saveCart({
      ...getCart(),
      idClient: Number($clientsSelect.value),
      clientName,
    })
    renderButtonDownload()
  })

  $clients.appendChild($clientsSelect)
  $cart.appendChild($clients)
}

function renderOptions(options, select, isUnique = false) {
  const cart = getCart()
  const $select = document.querySelector(select)

  let value
  let textContent
  let sortedOptions

  switch (select) {
    case '#selectClient':
      $select.innerHTML = !isUnique
        ? '<option value="" selected disabled>Seleccione un cliente</option>'
        : `<option value=${options[0].id} selected disabled>${options[0].name} - ${options[0].id}</option>`
      if (isUnique) {
        options = []
      }
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
      } else if ($option.value === cart.idSellCondition?.toString()) {
        $option.textContent = `${option[textContent]}`
        $option.selected = true
      } else if ($option.value === cart.idFreight?.toString()) {
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
            navigateToStore()
          }
        )
      } catch (error) {
        showToast(
          error.message,
          '',
          'linear-gradient(to right, #a25553, #79403e)'
        )
      }
    })
  }

  const $sendToDraft = document.createElement('button')
  $sendToDraft.className =
    'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400'
  $sendToDraft.textContent = 'Guardar borrador'
  if (cart.draft === 1) {
    $sendToDraft.textContent = 'Guardar cambios'
    $sendToDraft.classList.add('span-2')
  }
  $sendToDraft.type = 'button'
  $sendToDraft.addEventListener('click', async () => {
    await sendToDraft(getCart())
  })

  $buttonsContainer.appendChild($sendToDraft)

  const $resetButton = document.createElement('button')
  $resetButton.className =
    'button-cart bg-secondary-300 uppercase fw-semi-bold bg-hover-secondary-400 span-2'
  $resetButton.textContent = 'Vaciar carrito'
  $resetButton.type = 'button'
  $resetButton.addEventListener('click', e => {
    e.preventDefault()
    emptyCart()
    renderCart(getCart())
    navigateToStore()
  })
  $buttonsContainer.appendChild($resetButton)

  const $checkoutButton = document.createElement('button')
  $checkoutButton.className =
    'button-cart button-checkout bg-secondary-400 uppercase fw-semi-bold bg-hover-secondary-400 text-white'
  $checkoutButton.textContent = 'Finalizar compra'
  $checkoutButton.type = 'submit'
  $checkoutButton.addEventListener('click', e => {
    e.preventDefault()
    $checkoutButton.style =
      'pointer-events: none; opacity: 0.5; background-color: #a25553; cursor: not-allowed;'
    $checkoutButton.textContent = 'Finalizando..'
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
  $priceTotal.textContent = formatter.format(
    getTotalPrice(getCart()) < 0
      ? getTotalPrice(getCart()) * -1
      : getTotalPrice(getCart())
  )
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
  const url = item.url ? item.url[0] : ''
  if (url) {
    if (url.includes('G:\\FerozoWebHosting')) {
      const source = item.url[0]
        .split('\\')
        .slice(2)
        .filter(item => {
          return item !== 'public_html'
        })
        .join('\\')
      $image.src = `https://www.${source}`
    } else {
      $image.src = `https://www.${url}`
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
  $price.textContent = item.price
    ? formatter.format(item.price < 0 ? item.price * -1 : item.price.toFixed(0))
    : '$ 0'

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
    checkDiscount($discountInput.value)
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
  if (!SURPASS_STOCK) {
    $quantityInput.max = item.stock
  }
  $quantityInput.value = item.quantity
  $quantityInput.addEventListener('change', () => {
    if ($quantityInput.value > item.stock) {
      $quantityInput.value = item.stock
      showToast('La cantidad no puede ser mayor al stock, stock: ' + item.stock)
    }
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
  $container.classList.add('total__price')

  const $totalArticle = document.createElement('p')
  $totalArticle.className = 'total__article fw-bold'
  $totalArticle.textContent = formatter.format(
    item.priceTotal < 0
      ? item.priceTotal.toFixed(0) * -1
      : item.priceTotal.toFixed(0)
  )

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

async function selectFields({ idClient, idFreight, idSellCondition }) {
  if (!idClient || !idFreight || !idSellCondition) return

  const $selectClient = document.querySelector('#selectClient')
  const $selectFreight = document.querySelector('#flete')
  const $selectSellCondition = document.querySelector('#condicionVenta')

  $selectClient.querySelector(`option[value="${idClient}"]`).selected = true
  $selectFreight.querySelector(`option[value="${idFreight}"]`).selected = true
  $selectSellCondition.querySelector(
    `option[value="${idSellCondition}"]`
  ).selected = true
}

function createTable() {
  const $table = document.createElement('table')
  $table.className = 'fl-table'
  $table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Artículo</th>
        <th scope="col">Código</th>
        <th scope="col">Precio</th>
        <th scope="col">Descuento</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Total</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `

  return $table
}

/**
 * @param {ArticleOrder} item
 * */
function createTableRow(item) {
  const $row = document.createElement('tr')
  const totalPrice = item.totalDiscount || item.priceTotal
  $row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.id}</td>
    <td>${
      item.price
        ? formatter.format(
            item.price < 0 ? item.price.toFixed(0) * -1 : item.price.toFixed(0)
          )
        : '$ 0'
    }</td>
    <td>${item.discountPercentage}%</td>
    <td>${item.quantity}</td>
    <td>${formatter.format(
      totalPrice < 0 ? totalPrice * -1 : totalPrice.toFixed(0)
    )}</td>
  `
  return $row
}

function createTableTotalRow(cart) {
  const $totalRow = document.createElement('tr')
  $totalRow.className = 'table__total-row fw-bold'
  $totalRow.innerHTML = `
  <td>Total:</td>
  <td></td>
  <td></td>
  <td></td>
  <td>${cart.items}</td>
  <td>${formatter.format(
    Number(cart.total) < 0
      ? Number(cart.total) * -1
      : Number(cart.total).toFixed(0)
  )}</td>
  `
  return $totalRow
}

function renderButtonDownload() {
  if (document.querySelector('.button-download')) {
    document.querySelector('.button-download').remove()
  }

  const client = document
    .querySelector('#selectClient')
    .querySelector('option:checked')

  const clientName = client.text.split(' - ')[0]
  const clientCode = client.text.split(' - ')[1]

  if (clientName && clientCode) {
    renderTotalRow()
    const $downloadButton = document.createElement('button')
    $downloadButton.type = 'button'
    $downloadButton.className =
      'button-sm bg-slate bg-hover-secondary-300 ml-2 button-download'
    $downloadButton.innerHTML = '<i class="fa-solid fa-download"></i>'
    $downloadButton.onclick = async () => {
      const newCart = getCart()
      await updateOrder(newCart)
      downloadPDF(`${clientName} - ID: ${clientCode}`, createTableToDownload())
    }

    document.querySelector('.cart__header__icon').appendChild($downloadButton)
  }
}

function checkDiscount(value) {
  if (value <= 50) return

  showToast('Descuento mayor a 50%')
}
