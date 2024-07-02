import {
  downloadFile,
  getNotas,
  getPrepararNotas,
} from '../api/profileInterfaceGenerator.js'
import { showToast } from '../utils/showToast.js'
import { formatDate } from '../utils/formatDate.js'
import { formatter } from '../utils/formatPrice.js'
import { downloadNotas } from '../utils/downloadPDF.js'

export function renderInterfaceGenerator(parentElement) {
  parentElement.innerHTML = ''

  const $container = document.createElement('div')
  $container.className = 'interface__generator__container'

  const $buttonList = document.createElement('button')
  $buttonList.className = 'button-sm bg-secondary-300 bg-hover-secondary-400'
  $buttonList.textContent = 'Listar Interfaces'
  $buttonList.addEventListener('click', async () => {
    const notes = await getNotas()
    renderNotesList(notes)
  })

  const $buttonPrepare = document.createElement('button')
  $buttonPrepare.className =
    'button-sm bg-error-400 bg-hover-error-300 text-white'
  $buttonPrepare.textContent = 'Generar Interfaces'
  $buttonPrepare.addEventListener('click', async () => {
    const notes = await getNotas()
    const notesTotal = notes.reduce((total, note) => total + note.total, 0)
    await downloadNotas(notes, notes.length, notesTotal)

    await getPrepararNotas()
    renderNotesList(notes)

    showToast('Interfaces generadas')
  })

  const $buttonDownload = document.createElement('button')
  $buttonDownload.className =
    'button-sm bg-success-400 text-white bg-hover-success'
  $buttonDownload.textContent = 'Descargar Última Interfaz'
  $buttonDownload.addEventListener('click', e => {
    downloadFile()
  })

  $container.appendChild($buttonList)
  $container.appendChild($buttonPrepare)
  $container.appendChild($buttonDownload)

  parentElement.appendChild($container)

  const $tableContainer = document.createElement('div')
  $tableContainer.className = 'table-container'

  parentElement.appendChild($tableContainer)
}

async function renderNotesList(notes) {
  const $tableContainer = document.querySelector('.table-container')
  $tableContainer.innerHTML = ''

  const $table = await createTable()
  $tableContainer.appendChild($table)

  await renderTableRows(notes, '#table-body')
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
      <th scope="col">Total</th>
      <th scope="col" class="visually-hidden-mobile">Estado</th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>
  `

  return table
}

async function renderTableRows(notes, parentElement) {
  const $tableBody = document.querySelector(parentElement)
  $tableBody.innerHTML = ''

  if (notes.length <= 0) {
    const row = document.createElement('tr')
    const paragraph = document.createElement('td')
    paragraph.setAttribute('colspan', '5')
    paragraph.textContent = 'No se encontraron resultados.'
    row.appendChild(paragraph)
    $tableBody.appendChild(row)
  } else {
    for await (const obj of notes) {
      const $row = await createRow(obj)
      $tableBody.appendChild($row)
    }

    const $totalRow = createTotalRow(notes)
    $tableBody.appendChild($totalRow)
  }
}

async function createRow(note) {
  const { id, idClient, clientName, date, items, total, status } = note
  const $row = document.createElement('tr')
  $row.innerHTML = `
    <td>${id}</td>
    <td>${idClient} - ${clientName}</td>
    <td class="visually-hidden-mobile">${formatDate(date.split('T')[0])}</td>
    <td class="text-end">${items}</td>
    <td class="text-end">${formatter.format(
      total < 0 ? total.toFixed(0) * -1 : total.toFixed(0)
    )}</td>
    <td class="visually-hidden-mobile">${status}</td>
  `

  return $row
}

function createTotalRow(notes) {
  const $row = document.createElement('tr')
  $row.className = 'total-row'

  $row.innerHTML = `
  <td>Total</td>
  <td class="text-start">Notas: ${notes.length}</td>
  <td></td>
  <td></td>
  <td class="text-end">${formatter.format(
    notes.reduce((total, note) => total + note.total, 0).toFixed(0)
  )}</td>
  <td></td>
    `

  return $row
}
