import getDataFromDB from './utils/getDataFromDB.js'
import { sortClients } from './utils/sortClients.js'

export const profileClientAccount = async $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const data = await getDataFromDB('http://api.oagsa.com/api/cliente/all')
  const clients = await data.data

  $profileInfoContainer.innerHTML = `
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
}

const handleSubmit = e => {
  e.preventDefault()
  const $form = document.querySelector('#client-form')
  const selectedClient = $form.selectedClient.value

  if (selectedClient) {
    renderClientAccount(selectedClient)
  }
}

const renderOptions = clients => {
  const $selectClient = document.querySelector('#selectClient')
  sortClients(clients)

  clients.forEach(client => {
    const option = document.createElement('option')
    option.value = client.codigoCliente
    option.textContent = client.razonSocial

    $selectClient.appendChild(option)
  })
}

const renderClientAccount = async client => {
  const data = await getDataFromDB(
    `http://api.oagsa.com/api/cliente/cuenta-corriente?pCodigoCliente=${client}`
  )
  const accountMovements = await data.data

  const $tableContainer = document.querySelector('.table-container')
  $tableContainer.innerHTML = ''

  if (accountMovements.length > 0) {
    const table = document.createElement('table')
    table.classList.add('fl-table')
    table.innerHTML = `
    <thead>
    <tr>
        <th>Emisión</th>
        <th>Vencimiento</th>
        <th>Comprobante</th>
        <th>Importe</th>
        <th>Importe Pendiente</th>
    </tr>
    </thead>
    <tbody id='table-body'>
   
    <tbody>
  `

    $tableContainer.appendChild(table)
    const $tableBody = document.querySelector('#table-body')

    accountMovements.forEach(item => {
      renderTableRows(item, $tableBody)
    })
  }
}

const renderTableRows = (item, parent) => {
  const trimPrice = price => {
    if (price < 0) {
      return price * -1
    }
    return price
  }

  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
      <td>${item.fechaEmision.slice(0, 10)}</td>
      <td>${item.fechaVencimiento.slice(0, 10)}</td>
      <td>${item.numero}</td>
      <td>$${trimPrice(item.importe)}</td>
      <td>$${trimPrice(item.importePendiente)}</td>
      `
  parent.appendChild(tableRow)
}
