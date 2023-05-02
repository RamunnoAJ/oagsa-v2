import getDataFromDB from '../utils/getDataFromDB.js'
import { sortClients } from '../utils/sortClients.js'

export const renderOptions = clients => {
  const $selectClient = document.querySelector('#selectClient')
  sortClients(clients)

  clients.forEach(client => {
    const option = document.createElement('option')
    option.value = client.codigoCliente
    option.textContent = client.razonSocial

    $selectClient.appendChild(option)
  })
}

export const renderClientAccount = async client => {
  const $tableContainer = document.querySelector('.table-container')
  $tableContainer.innerHTML = '<span class="loader"></span>'

  const response = await getDataFromDB(
    `http://api.oagsa.com/api/cliente/cuenta-corriente?pCodigoCliente=${client}`
  )
  const accountMovements = await response.data

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

    const prices = []

    accountMovements.forEach(item => {
      renderTableRows(item, $tableBody)
      prices.push(item.importePendiente)
    })

    const totalPriceRow = document.createElement('tr')
    totalPriceRow.innerHTML = `
      <td class="fw-bold">Importe total:</td>
      <td></td>
      <td></td>
      <td></td>
      <td class="fw-bold">$${getTotalPrice(prices)}</td>
      `

    $tableBody.appendChild(totalPriceRow)
  } else {
    $tableContainer.innerHTML = `<span>No se encontraron resultados</span>`
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
      <td class="fw-bold">$${trimPrice(item.importePendiente)}</td>
      `
  parent.appendChild(tableRow)
}

const getTotalPrice = prices => {
  let totalPrice = 0

  for (let index = 0; index < prices.length; index++) {
    const element = prices[index]

    totalPrice += element
  }

  if (totalPrice < 0) {
    return totalPrice * -1
  }

  return totalPrice.toFixed(2)
}
