import { deleteDraft, editDraft } from '../profileDrafts.js'
import { formatDate } from '../utils/formatDate.js'
import { formatter } from '../utils/formatPrice.js'

/**
 * @typedef {import('../entities/clients.js').Client}
 * @typedef {import('../entities/orders.js').Order}
 * */

export async function renderDrafts(drafts, parentElement) {
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
      <th scope="col">Total</th>
      <th scope="col" class="visually-hidden-mobile"></th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>`

  return table
}

/**
 * @param {Order[]} drafts
 * @param {HTMLElement} parentElement
 * */
async function renderTableRows(drafts, parentElement) {
  const $table = document.querySelector(parentElement)

  if (drafts.length === 0) {
    const $row = document.createElement('tr')
    $row.innerHTML = `<td colspan="6">No hay pedidos en el borrador</td>`

    $table.appendChild($row)
  }

  drafts.forEach(draft => {
    const row = document.createElement('tr')
    row.className = 'cursor-pointer bg-hover-slate'
    row.innerHTML = `
      <td>${draft.id}</td>
      <td class="text-start">${draft.clientName} - ${draft.idClient}</td>
      <td>${formatDate(draft.date.split('T')[0])}</td>
      <td class="text-end">${draft.items}</td>
      <td class="text-end">${formatter.format(draft.total.toFixed(0))}</td>
      <td class="fl-table__icons visually-hidden-mobile">
        <i id="btn-edit-${draft.id}" class="fa-solid fa-pen"></i>
        <i id="btn-delete-${draft.id}" class="fa-solid fa-trash"></i>
      </td>
    `
    row.addEventListener('click', () => {
      editDraft(draft.id)
    })

    $table.appendChild(row)

    const $btnDelete = document.querySelector(`#btn-delete-${draft.id}`)
    const $btnEdit = document.querySelector(`#btn-edit-${draft.id}`)

    $btnDelete.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      deleteDraft(draft.id)
    })

    $btnEdit.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      editDraft(draft.id)
    })
  })
}

export function navigateToCart() {
  window.location.replace('./cart.html')
}
