import { getClients } from "../api/cart.js"
import { deleteDraft, editDraft } from "../profileDrafts.js"
import { getStorageID } from "../storage/profileClientAccount.js"

const sellerID = getStorageID()
const clients = await getClients(sellerID)

export function renderDrafts(drafts, parentElement) {
  parentElement.innerHTML = ''

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

async function renderTableRows(drafts, parentElement){
  const $table = document.querySelector(parentElement)

  drafts.forEach(draft => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${draft.numeroNota}</td>
      <td>${clients.filter(client => client.codigoCliente === draft.codigoCliente)[0].razonSocial} - ${draft.codigoCliente}</td>
      <td>${draft.fechaNota.split('T')[0]}</td>
      <td>${draft.totalItems}</td>
      <td>$${draft.totalPesos}</td>
      <td class="fl-table__icons visually-hidden-mobile">
        <i id="btn-edit-${draft.numeroNota}" class="fa-solid fa-pen"></i> 
        <i id="btn-delete-${draft.numeroNota}" class="fa-solid fa-trash"></i>
      </td>
    `
    row.classList.add('cursor-pointer')
    row.addEventListener('click', () => {
      editDraft(draft.numeroNota)
    })

    $table.appendChild(row)

    const $btnDelete = document.querySelector(`#btn-delete-${draft.numeroNota}`)
    const $btnEdit = document.querySelector(`#btn-edit-${draft.numeroNota}`)

    $btnDelete.addEventListener('click', () => {
      deleteDraft(draft.numeroNota)
    })

    $btnEdit.addEventListener('click', () => {
      editDraft(draft.numeroNota)
    })

  })
}

export function navigateToCart() {
  window.location.replace('./cart.html')
}
