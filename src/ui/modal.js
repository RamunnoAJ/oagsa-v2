import { getCondicionVenta } from '../api/profileOrdersHistory.js'
import { downloadPDF } from '../utils/downloadPDF.js'
import { formatDate } from '../utils/formatDate.js'
import { formatter } from '../utils/formatPrice.js'

export async function createModal() {
  const $modal = document.createElement('div')
  $modal.className = 'modal'
  $modal.innerHTML = `
    <div id="modal">
    </div>
  `

  return $modal
}

export async function createOverlay() {
  const $overlay = document.createElement('div')
  $overlay.className = 'overlay'
  $overlay.addEventListener('click', () => {
    closeModal()
  })

  return $overlay
}

function closeModal() {
  const $modal = document.querySelector('.modal')
  $modal.remove()
  const $overlay = document.querySelector('.overlay')
  $overlay.remove()
}

async function createTable() {
  const $table = document.createElement('table')
  $table.classList.add('fl-table')
  $table.id = 'modal__table'
  $table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">Articulo</th>
      <th scope="col">Descripción</th>
      <th scope="col">Precio unitario</th>
      <th scope="col">Precio con dto.</th>
      <th scope="col">Descuento</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Precio total</th>
    </tr>
  </thead>
  <tbody id="modal__table-body">
  </tbody>
  `

  return $table
}

export async function renderModalContent(order) {
  const $modal = document.querySelector('#modal')
  const $modalHeader = document.createElement('div')
  $modalHeader.className = 'modal__header my-4'
  $modal.appendChild($modalHeader)

  const $modalTitle = document.createElement('h2')
  $modalTitle.className = 'modal__title'
  $modalTitle.textContent = `# ${order.id}`
  $modalHeader.appendChild($modalTitle)

  const $downloadButton = document.createElement('button')
  $downloadButton.type = 'button'
  $downloadButton.className = 'button-sm bg-slate bg-hover-secondary-300'
  $downloadButton.innerHTML = '<i class="fa-solid fa-download"></i>'
  $downloadButton.onclick = () => {
    downloadPDF(
      `Número de orden: ${order.id}`,
      null,
      `Razón social: ${order.clientName}`
    )
  }
  $modalHeader.appendChild($downloadButton)

  const $modalContent = await createModalContent(order)
  $modal.appendChild($modalContent)

  const $tableContainer = document.createElement('div')
  $tableContainer.className = 'table-container'
  $modal.appendChild($tableContainer)

  const $table = await createTable()
  $tableContainer.appendChild($table)

  const $modalTable = document.querySelector('#modal__table-body')
  $modalTable.innerHTML = ''

  order.detail.forEach(article => {
    const $article = createProductRow(article)
    $modalTable.appendChild($article)
  })

  const $totalRow = createTotalRow(order)
  $modalTable.appendChild($totalRow)
}

function createTotalRow(total) {
  const $totalRow = document.createElement('tr')
  $totalRow.className = 'modal__total-row fw-bold'
  $totalRow.innerHTML = `
  <td class="text-start">Total:</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td class="text-end">${total.items}</td>
  <td class="text-end">${formatter.format(
    total.total < 0 ? total.total.toFixed(0) * -1 : total.total.toFixed(0)
  )}</td>
  `
  return $totalRow
}

function createProductRow(article) {
  const unitPrice = article.priceDiscount || article.price
  const totalPrice = article.priceTotal || article.total

  const $row = document.createElement('tr')
  $row.classList.add('modal__product__row')
  $row.innerHTML = `
    <td class="text-start">${article.id}</td>
    <td class="text-start">${article.name}</td>
    <td class="text-end">${formatter.format(article.price.toFixed(0))}</td>
    <td class="text-end">${formatter.format(
      unitPrice < 0 ? unitPrice.toFixed(0) * -1 : unitPrice.toFixed(0)
    )}</td>
    <td class="text-end">${article.discount}</td>
    <td class="text-end">${article.quantity}</td>
    <td class="text-end">${formatter.format(
      totalPrice < 0 ? totalPrice.toFixed(0) * -1 : totalPrice.toFixed(0)
    )}</td>
  `
  return $row
}

async function createModalContent(order) {
  const $modalContent = document.createElement('div')
  $modalContent.className = 'modal__content mb-4'

  const descriptionCondicionVenta = await getCondicionVenta(
    order.idSellCondition
  )

  $modalContent.innerHTML = `
    <p class="mb-2">Razón social: <span>${order.clientName}</span></p>
    <p class="mb-2">Estado: <span>${order.status}</span></p>
    <p class="mb-2">Fecha: <span>${formatDate(
      order.date.split('T')[0]
    )}</span></p>
    <p class="mb-2">Descripción flete: <span>${
      order.freight || 'No definido'
    }</span></p>
    <p class="mb-2">Condicion de venta: <span>${
      descriptionCondicionVenta || 'No definido'
    }</span></p>
    <p class="mb-2">Observaciones: <span>${
      order.observations || 'Ninguna'
    }</span></p>
  `

  return $modalContent
}
