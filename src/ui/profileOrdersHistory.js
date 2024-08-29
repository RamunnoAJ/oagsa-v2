import { getOrders, getOrdersDates } from '../api/profileOrdersHistory.js'
import { getStorageID } from '../storage/profileClientAccount.js'
import { formatDate } from '../utils/formatDate.js'
import { sortClients } from '../utils/sortClients.js'
import { createModal, createOverlay, renderModalContent } from './modal.js'
import { renderPaginationButtons } from './pagination.js'
import { formatter } from '../utils/formatPrice.js'
import { getUserFromStorage } from '../storage/storageData.js'

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

  renderDates($profileInfoContainer)
  renderOrders(response, $profileInfoContainer)
}

async function getOrdersPage(page) {
  const $selectClient = document.querySelector('#selectClient')
  const selectedClient = $selectClient.value
  const sellerID = await getStorageID()
  const user = JSON.parse(getUserFromStorage())

  if (user.role !== 3) {
    return await getOrders(sellerID, selectedClient, page)
  } else {
    return await getOrders(user.idSeller, user.idUser, page)
  }
}

async function getOrdersDatesPage(page, fromDate, toDate) {
  const $selectClient = document.querySelector('#selectClient')
  const selectedClient = $selectClient.value
  const sellerID = await getStorageID()

  return await getOrdersDates(sellerID, selectedClient, page, fromDate, toDate)
}

async function renderOrdersPage(page) {
  const $profileInfoContainer = document.querySelector('#profileInfoContainer')
  const response = await getOrdersPage(page)

  renderOrders(response, $profileInfoContainer)
}

async function renderOrdersDatesPage(page) {
  const fromDate = document.querySelector('#fromDate').value
  const toDate = document.querySelector('#toDate').value

  const $profileInfoContainer = document.querySelector('#profileInfoContainer')
  const response = await getOrdersDatesPage(page, fromDate, toDate)

  renderOrders(response, $profileInfoContainer, true)
}

function renderOptions(clients) {
  const $selectClient = document.querySelector('#selectClient')
  sortClients(clients)

  clients.forEach(client => {
    const option = document.createElement('option')
    option.value = client.id
    option.textContent = `${client.name} - ${client.id}`

    $selectClient.appendChild(option)
  })
}

export async function renderOrders(orders, parentElement, dates = false) {
  if (document.querySelector('.fl-table')) {
    document.querySelector('.fl-table').remove()
  }

  const sortedOrders = orders.sort((a, b) => a.id - b.id)
  const table = await createTable()
  parentElement.appendChild(table)

  renderTableRows(sortedOrders, '#table-body')

  if (dates) {
    renderPaginationButtons(
      orders.previous,
      orders.next,
      renderOrdersDatesPage,
      parentElement,
      orders.totalPages
    )
  } else {
    renderPaginationButtons(
      orders.previous,
      orders.next,
      renderOrdersPage,
      parentElement,
      orders.totalPages
    )
  }
}

async function createTable() {
  const table = document.createElement('table')
  table.classList.add('fl-table')
  table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Razón social</th>
      <th scope="col" class="visually-hidden-mobile">Fecha</th>
      <th scope="col">Articulos</th>
      <th scope="col">Total</th>
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
      row.dataset.id = order.id
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.idClient} - ${order.clientName}</td>
        <td class="visually-hidden-mobile">${formatDate(
          order.date.split('T')[0]
        )}</td>
        <td class="text-end">${order.items}</td>
        <td class="text-end">${formatter.format(
          order.total < 0 ? order.total.toFixed(0) * -1 : order.total.toFixed(0)
        )}</td>
        <td class="visually-hidden-mobile">${order.status}</td>
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

async function createInputsDate() {
  const $dateContainer = document.createElement('div')
  $dateContainer.className = 'date-container'

  const $inputContainer = document.createElement('div')
  $inputContainer.className = 'input-container'

  const $labelFromDate = document.createElement('label')
  $labelFromDate.textContent = 'Desde: '
  $labelFromDate.htmlFor = 'fromDate'

  const $fromDate = document.createElement('input')
  $fromDate.type = 'date'
  $fromDate.id = 'fromDate'
  $fromDate.name = 'fromDate'

  $inputContainer.appendChild($labelFromDate)
  $inputContainer.appendChild($fromDate)

  const $inputContainer2 = document.createElement('div')
  $inputContainer2.className = 'input-container'

  const $labelToDate = document.createElement('label')
  $labelToDate.textContent = 'Hasta: '
  $labelToDate.htmlFor = 'toDate'

  const $toDate = document.createElement('input')
  $toDate.type = 'date'
  $toDate.id = 'toDate'
  $toDate.name = 'toDate'

  $inputContainer2.appendChild($labelToDate)
  $inputContainer2.appendChild($toDate)

  const $searchButton = document.createElement('button')
  $searchButton.textContent = 'Buscar'
  $searchButton.addEventListener('click', async () => {
    const orders = await getOrdersDatesPage(1, $fromDate.value, $toDate.value)
    renderOrders(orders, document.querySelector('#profileInfoContainer'), true)
  })
  $searchButton.className = 'button bg-secondary-300 bg-hover-secondary-400'

  $dateContainer.appendChild($inputContainer)
  $dateContainer.appendChild($inputContainer2)
  $dateContainer.appendChild($searchButton)

  return $dateContainer
}

async function renderDates(parentElement) {
  if (document.querySelector('.date-container')) {
    document.querySelector('.date-container').remove()
  }

  const $dateContainer = await createInputsDate()
  parentElement.appendChild($dateContainer)
}
