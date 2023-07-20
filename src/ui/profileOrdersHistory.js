export async function renderOrders(orders, parentElement){
  parentElement.innerHTML = ''

  const table = await createTable()
  parentElement.appendChild(table)

  renderTableRows(orders, '#table-body')
}

async function createTable(){
  const table = document.createElement('table')
  table.classList.add('fl-table')
  table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">Numero de Nota</th>
      <th scope="col">Cliente</th>
      <th scope="col">Fecha</th>
      <th scope="col">Cantidad Articulos</th>
      <th scope="col">Precio</th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>
  `

  return table
}

function renderTableRows(orders, parentElement){
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
      row.innerHTML = `
        <td>${order.numeroNota}</td>
        <td>${order.codigoCliente}</td>
        <td>${order.fechaNota.split('T')[0]}</td>
        <td>${order.totalItems}</td>
        <td>$${order.totalPesos}</td>
      `

      $table.appendChild(row)
    })
  }

}
