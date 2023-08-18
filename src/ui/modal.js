import { getCondicionVenta } from '../api/profileOrdersHistory.js'
import { formatDate } from '../utils/formatDate.js'

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
  const $modalTitle = document.createElement('h2')
  $modalTitle.className = 'modal__title mb-4'
  $modalTitle.textContent = `# ${order.numeroNota}`
  $modal.appendChild($modalTitle)

  const $modalContent = await createModalContent(order)
  $modal.appendChild($modalContent)

  const $table = await createTable()
  $modal.appendChild($table)

  const $modalTable = document.querySelector('#modal__table-body')
  $modalTable.innerHTML = ''

  order.listaDetalle.forEach(article => {
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
  <td>Total:</td>
  <td></td>
  <td></td>
  <td>${total.totalItems}</td>
  <td>$${total.totalPesos}</td>
  `
  return $totalRow
}

function createProductRow(article) {
  const $row = document.createElement('tr')
  $row.classList.add('modal__product__row')
  $row.innerHTML = `
    <td>${article.codigoArticulo}</td>
    <td>${article.descripcionArticulo}</td>
    <td>$${article.precioConDescuento || article.precio}</td>
    <td>${article.cantidadPedida}</td>
    <td>$${article.importeDescuento || article.montoTotal}</td>
  `
  return $row
}

async function createModalContent(order) {
  const $modalContent = document.createElement('div')
  $modalContent.className = 'modal__content mb-4'

  const descriptionCondicionVenta = await getCondicionVenta(
    order.codigoCondicionVenta
  )

  $modalContent.innerHTML = `
    <p class="mb-2">Estado: <span>${order.estado}</span></p>
    <p class="mb-2">Fecha: <span>${formatDate(
      order.fechaNota.split('T')[0]
    )}</span></p>
    <p class="mb-2">Descripción flete: <span>${
      order.descripcionFlete || 'No definido'
    }</span></p>
    <p class="mb-2">Condicion de venta: <span>${
      descriptionCondicionVenta || 'No definido'
    }</span></p>
    <p class="mb-2">Observaciones: <span>${
      order.observaciones || 'Ninguna'
    }</span></p>
  `

  return $modalContent
}
