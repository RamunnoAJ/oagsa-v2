import { getOrders } from '../api/profileOrdersHistory.js'
import { getStorageID } from '../storage/profileClientAccount.js'
import { formatDate } from '../utils/formatDate.js'
import { sortClients } from '../utils/sortClients.js'
import { createModal, createOverlay, renderModalContent } from './modal.js'
import { renderPaginationButtons } from './pagination.js'

export async function renderSelect(options, parentElement) {
  parentElement.innerHTML = ''
  const $container = document.createElement('div')
  $container.className = 'container__select'

  const select = await createSelect()
  $container.appendChild(select)

  const $help = document.createElement('span')
  $help.className = 'help ml-4'

  const $icon = document.createElement('i')
  $icon.className = 'fa-regular fa-circle-question'

  $help.appendChild($icon)
  $container.appendChild($help)

  parentElement.appendChild($container)
  renderOptions(options)
}

async function createSelect() {
  const $select = document.createElement('select')
  $select.innerHTML =
    '<option value="0" disabled selected>Seleccione un cliente...</option><option value="0">-- TODOS --</option>'
  $select.id = 'selectClient'
  $select.classList.add('select')
  $select.addEventListener('change', handleSelect)

  return $select
}

function createLoader() {
  const $loader = document.createElement('span')
  $loader.classList.add('loader')
  return $loader
}

async function handleSelect() {
  const $profileInfoContainer = document.querySelector('#profileInfoContainer')
  const FIRST_PAGE = 1

  const $loader = createLoader()
  $profileInfoContainer.appendChild($loader)

  const response = await getOrdersPage(FIRST_PAGE)
  $loader.remove()

  renderOrders(response, $profileInfoContainer)
}

async function getOrdersPage(page) {
  const $selectClient = document.querySelector('#selectClient')
  const selectedClient = $selectClient.value
  const sellerID = await getStorageID()

  return await getOrders(sellerID, selectedClient, page)
}

async function renderOrdersPage(page) {
  const $profileInfoContainer = document.querySelector('#profileInfoContainer')
  const response = await getOrdersPage(page)

  renderOrders(response, $profileInfoContainer)
}

function renderOptions(clients) {
  const $selectClient = document.querySelector('#selectClient')
  sortClients(clients)

  clients.forEach(client => {
    const option = document.createElement('option')
    option.value = client.id
    option.textContent = `${client.id} - ${client.name}`

    $selectClient.appendChild(option)
  })
}

export async function renderOrders(orders, parentElement) {
  if (document.querySelector('.fl-table')) {
    document.querySelector('.fl-table').remove()
  }

  const sortedOrders = orders.data.sort((a, b) => a.numeroNota - b.numeroNota)
  const table = await createTable()
  parentElement.appendChild(table)

  renderTableRows(sortedOrders, '#table-body')
  renderPaginationButtons(
    orders.previous,
    orders.next,
    renderOrdersPage,
    parentElement,
    orders.totalPages
  )
}

async function createTable() {
  const table = document.createElement('table')
  table.classList.add('fl-table')
  table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Cliente</th>
      <th scope="col" class="visually-hidden-mobile">Fecha</th>
      <th scope="col">Articulos</th>
      <th scope="col">Precio</th>
      <th scope="col" class="visually-hidden-mobile">Estado</th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>
  `

  return table
}

function renderTableRows(orders, parentElement) {
  const $table = document.querySelector(parentElement)

  if (orders.length <= 0) {
    const row = document.createElement('tr')
    const paragraph = document.createElement('td')
    paragraph.setAttribute('colspan', '5')
    paragraph.textContent = 'No se encontraron resultados.'
    row.appendChild(paragraph)
    $table.appendChild(row)
  } else {
    orders.forEach(order => {
      const row = document.createElement('tr')
      row.className = 'orders__table__row'
      row.dataset.id = order.numeroNota
      row.innerHTML = `
        <td>${order.numeroNota}</td>
        <td>${order.codigoCliente}</td>
        <td class="visually-hidden-mobile">${formatDate(
          order.fechaNota.split('T')[0]
        )}</td>
        <td>${order.totalItems}</td>
        <td>$${order.totalPesos.toFixed(0)}</td>
        <td class="visually-hidden-mobile">${order.estado}</td>
      `

      row.addEventListener('click', () => {
        renderModal(order)
      })
      $table.appendChild(row)
    })
  }
}

async function renderModal(order) {
  if (document.querySelector('.modal')) {
    document.querySelector('.modal').remove()
    document.querySelector('.overlay').remove()
  }

  const $modal = await createModal()
  const $overlay = await createOverlay()
  const $profileInfo = document.querySelector('.profile-info')
  $profileInfo.appendChild($modal)
  $profileInfo.appendChild($overlay)

  renderModalContent(order)
}
