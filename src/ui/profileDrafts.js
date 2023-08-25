import { getClients } from '../api/cart.js'
import { deleteDraft, editDraft } from '../profileDrafts.js'
import { getStorageID } from '../storage/profileClientAccount.js'
import { formatDate } from '../utils/formatDate.js'

const sellerID = getStorageID()
let clients
if (sellerID) {
  clients = await getClients(sellerID)
}

export function renderDrafts(drafts, parentElement) {
  parentElement.innerHTML = ''
  const $container = document.createElement('div')
  $container.className = 'full-width text-end'

  const $help = document.createElement('span')
  $help.className = 'help mr-20 text-center'

  const $icon = document.createElement('i')
  $icon.className = 'fa-regular fa-circle-question'

  $help.appendChild($icon)
  $container.appendChild($help)
  parentElement.appendChild($container)

  const table = createTable(drafts)
  parentElement.appendChild(table)

  renderTableRows(drafts, '#table-body')
}

function createTable() {
  const table = document.createElement('table')
  table.classList.add('fl-table')
  table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">Numero de Nota</th>
      <th scope="col">Cliente</th>
      <th scope="col">Fecha</th>
      <th scope="col">Artículos</th>
      <th scope="col">Precio</th>
      <th scope="col" class="visually-hidden-mobile"></th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>`

  return table
}

async function renderTableRows(drafts, parentElement) {
  const $table = document.querySelector(parentElement)

  drafts.forEach(draft => {
    const row = document.createElement('tr')
    row.className = 'cursor-pointer bg-hover-slate'
    row.innerHTML = `
      <td>${draft.numeroNota}</td>
      <td>${
        clients.filter(
          client => client.codigoCliente === draft.codigoCliente
        )[0]?.razonSocial || 'Sin nombre'
      } - ${draft.codigoCliente}</td>
      <td>${formatDate(draft.fechaNota.split('T')[0])}</td>
      <td>${draft.totalItems}</td>
      <td>$${draft.totalPesos.toFixed(0)}</td>
      <td class="fl-table__icons visually-hidden-mobile">
        <i id="btn-edit-${draft.numeroNota}" class="fa-solid fa-pen"></i> 
        <i id="btn-delete-${draft.numeroNota}" class="fa-solid fa-trash"></i>
      </td>
    `
    row.addEventListener('click', () => {
      editDraft(draft.numeroNota)
    })

    $table.appendChild(row)

    const $btnDelete = document.querySelector(`#btn-delete-${draft.numeroNota}`)
    const $btnEdit = document.querySelector(`#btn-edit-${draft.numeroNota}`)

    $btnDelete.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      deleteDraft(draft.numeroNota)
    })

    $btnEdit.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      editDraft(draft.numeroNota)
    })
  })
}

export function navigateToCart() {
  window.location.replace('./cart.html')
}
