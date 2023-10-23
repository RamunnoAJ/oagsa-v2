import { getAccountMovements } from '../api/profileClientAccount.js'
import { formatDate } from '../utils/formatDate.js'
import { sortClients } from '../utils/sortClients.js'
import { formatter } from '../utils/formatPrice.js'
import { showToast } from './cart.js'
import { downloadPDF } from '../utils/downloadPDF.js'

/** @typedef {import('../mappers/accountMovements.js').Movement} Movement
 *  @typedef {import('../entities/clients.js').Client} Client
 * */

/**
 * @param {Client[]} clients
 * @param {HTMLElement} parentElement
 * */
export function renderProfileClientAccount(clients, parentElement) {
  if (clients.length > 0) {
    parentElement.innerHTML = `
    <span class="profile-info__subtitle">Razón social:</span>
    <form class="profile-info__search" id='client-form'>
      <select id="selectClient" name='selectedClient' class="select bg-primary mr-4">
        <option disabled selected value=''>Selecione una opción...</option>
      </select>
      <button class="button bg-secondary-300 bg-hover-secondary-400" id="btnSearch"> <span
            class="visually-hidden-mobile">Buscar</span>
        <span class="visually-hidden-desktop">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span> </button>
    </form>
    <div class='table-container'></div>
          `
    renderOptions(clients)

    const $btnSearch = document.querySelector('#btnSearch')
    $btnSearch.addEventListener('click', handleSubmit)
  } else {
    parentElement.innerHTML = `<div>No se encontraron resultados</div>`
  }
}

/**
 * @param {Event} e
 * */
function handleSubmit(e) {
  e.preventDefault()
  const $form = document.querySelector('#client-form')
  const selectedClient = $form.selectedClient.value

  if (selectedClient) {
    renderClientAccount(selectedClient)
  }
}

/**
 * @param {Client[]} clients
 * */
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

/**
 * @param {Client} client
 * */
async function renderClientAccount(client) {
  const $tableContainer = document.querySelector('.table-container')
  $tableContainer.innerHTML = '<span class="loader"></span>'

  const accountMovements = await getAccountMovements(client)

  $tableContainer.innerHTML = ''

  if (accountMovements.length > 0) {
    const table = document.createElement('table')
    table.classList.add('fl-table')
    table.innerHTML = `
    <thead>
    <tr>
        <th>Emisión</th>
        <th>Vencimiento</th>
        <th>N° Comprobante</th>
        <th>Letra</th>
        <th>Tipo</th>
        <th>Importe</th>
        <th>Importe Pendiente</th>
    </tr>
    </thead>
    <tbody id='table-body'>

    <tbody>
  `

    $tableContainer.appendChild(table)
    const $tableBody = document.querySelector('#table-body')

    const prices = []

    accountMovements.forEach(item => {
      renderTableRows(item, $tableBody)
      prices.push(item.pending)
    })

    const totalPriceRow = document.createElement('tr')
    totalPriceRow.innerHTML = `
      <td class="fw-bold">Importe total:</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td class="fw-bold">${formatter.format(getTotalPrice(prices))}</td>
      `

    $tableBody.appendChild(totalPriceRow)

    const $btnDownload = document.createElement('button')
    $btnDownload.className =
      'button bg-secondary-300 bg-hover-secondary-400 mt-4'
    $btnDownload.innerHTML = `
              <span class="visually-hidden-mobile">Descargar</span>
              <span class="visually-hidden-desktop">
                <i class="fa-solid fa-download"></i>
              </span>
    `
    $btnDownload.addEventListener('click', e => {
      e.preventDefault()
      try {
        const selectedOption = document
          .querySelector('#selectClient')
          .querySelector('option:checked').textContent
        console.log(selectedOption)

        downloadPDF(selectedOption)
      } catch (error) {
        showToast('Debes seleccionar alguna tabla para descargar')
      }
    })
    $tableBody.parentNode.parentNode.appendChild($btnDownload)
  } else {
    $tableContainer.innerHTML = `<span>No se encontraron resultados</span>`
  }
}

/**
 * @param {Movement} item
 * @param {HTMLElement} parentElement
 * */
function renderTableRows(item, parentElement) {
  const trimPrice = price => {
    if (price < 0) {
      return price * -1
    }
    return price
  }

  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
      <td>${formatDate(item.date.slice(0, 10))}</td>
      <td>${formatDate(item.expirationDate.slice(0, 10))}</td>
      <td>${item.number}</td>
      <td>${item.letter}</td>
      <td>${item.voucher}</td>
      <td class="text-end">${formatter.format(item.amount.toFixed(0))}</td>
      <td class="fw-bold">${formatter.format(
        trimPrice(item.pending.toFixed(0))
      )}</td>
      `
  parentElement.appendChild(tableRow)
}

/**
 * @param {number[]} prices
 * @returns {number}
 * */
function getTotalPrice(prices) {
  let totalPrice = 0

  for (let index = 0; index < prices.length; index++) {
    const element = prices[index]

    totalPrice += element
  }

  if (totalPrice < 0) {
    return totalPrice * -1
  }

  return totalPrice.toFixed(0)
}
