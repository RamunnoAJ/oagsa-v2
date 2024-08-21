import {
  getCustomerPreload,
  postCustomerPreload,
  toggleCustomPreloadState,
} from '../api/profileCustomerPreload.js'
import { getUserFromStorage } from '../storage/storageData.js'
import { showToast } from '../utils/showToast.js'
import { downloadPDF } from '../utils/downloadPDF.js'
import { csvExport } from '../entities/csv.js'

/** @param {HTMLElement} parentElement  */
export async function renderCustomerPreload(parentElement) {
  const user = JSON.parse(getUserFromStorage())
  parentElement.innerHTML = ''

  const $container = document.createElement('div')
  $container.className = 'customer-preload__container '

  const $nav = document.createElement('ul')
  $nav.className = 'customer-preload__header'

  const $navItem = document.createElement('li')
  $navItem.className = 'customer-preload__header__item active'
  $navItem.innerText = 'Formulario de altas'

  const $navItem2 = document.createElement('li')
  $navItem2.className = 'customer-preload__header__item'
  $navItem2.innerText = 'Listado'

  const $customerPreload = createForm()
  const $customerTable = createTable()

  if (user.role === 1) {
    $customerPreload.classList.add('visually-hidden')
    $navItem2.classList.add('active')
    $customerTable.classList.remove('visually-hidden')
    $navItem.classList.remove('active')
  }

  $navItem.addEventListener('click', () => {
    $customerPreload.classList.remove('visually-hidden')
    $navItem.classList.add('active')
    $customerTable.classList.add('visually-hidden')
    $navItem2.classList.remove('active')
  })

  $navItem2.addEventListener('click', () => {
    $customerPreload.classList.add('visually-hidden')
    $navItem2.classList.add('active')
    $customerTable.classList.remove('visually-hidden')
    $navItem.classList.remove('active')
  })

  $nav.appendChild($navItem)
  $nav.appendChild($navItem2)
  $container.appendChild($nav)
  $container.appendChild($customerPreload)
  $container.appendChild($customerTable)
  parentElement.appendChild($container)
}

/** @returns {HTMLFormElement} */
function createForm() {
  const $form = document.createElement('form')
  $form.className = 'customer-preload__form'

  const $name = createField('text', 'name', 'Razón social', false, true)
  $form.appendChild($name)

  const $address = createField('text', 'address', 'Dirección')
  $form.appendChild($address)

  const $city = createField('text', 'city', 'Localidad')
  $form.appendChild($city)

  const $zip = createField('text', 'zip', 'Código postal')
  $form.appendChild($zip)

  const $phone = createField('text', 'phone', 'Teléfono')
  $form.appendChild($phone)

  const $email = createField('text', 'email', 'Email')
  $form.appendChild($email)

  const $cuit = createField('text', 'cuit', 'Cuit', false, true)
  $form.appendChild($cuit)

  const $observations = createField(
    'text',
    'observations',
    'Observaciones',
    true
  )
  $form.appendChild($observations)

  const $submit = document.createElement('button')
  $submit.className = 'customer-preload__form__submit'
  $submit.type = 'submit'
  $submit.textContent = 'Grabar'

  $form.appendChild($submit)
  $form.addEventListener('submit', handleSubmitForm)

  return $form
}

async function handleSubmitForm(e) {
  e.preventDefault()

  const $form = e.target
  const $name = $form.name
  const $address = $form.address
  const $city = $form.city
  const $zip = $form.zip
  const $phone = $form.phone
  const $email = $form.email
  const $cuit = $form.cuit
  const $observations = $form.observations

  const user = JSON.parse(getUserFromStorage())

  await postCustomerPreload('clienteprecarga', {
    razonSocial: $name.value,
    direccion: $address.value,
    localidad: $city.value,
    codigoPostal: $zip.value,
    telefono: $phone.value,
    email: $email.value,
    codigoVendedor: user.id,
    cuit: $cuit.value,
    observaciones: $observations.value,
    nombreVendedor: '',
    leido: 0,
    estado: '',
  })

  showToast(`Se ha guardado correctamente el cliente ${$name.value}`)

  $form.reset()
}

/** @param {string} type
 * @param {string} name
 * @param {string} label
 * @param {boolean} textarea
 * @param {boolean} required
 * @returns {HTMLDivElement}
 */
function createField(type, name, label, textarea = false, required = false) {
  const $field = document.createElement('div')
  $field.className = 'customer-preload__form__field'

  const $label = document.createElement('label')
  $label.className = 'customer-preload__form__label'
  $label.textContent = label
  $label.htmlFor = `form-preload-${name}`

  $field.appendChild($label)

  if (textarea) {
    $label.className = 'customer-preload__form__label--textarea'
    $field.className = 'customer-preload__form__field--textarea'

    const $textarea = document.createElement('textarea')
    $textarea.className = 'customer-preload__form__textarea'
    $textarea.id = `form-preload-${name}`
    $textarea.name = name

    $field.appendChild($textarea)
  } else {
    const $input = document.createElement('input')
    $input.className = 'customer-preload__form__input'
    $input.type = type
    $input.name = name
    $input.id = `form-preload-${name}`
    $input.required = required

    $field.appendChild($input)
  }

  return $field
}

function createOption(text, value) {
  const $option = document.createElement('option')
  $option.textContent = text
  $option.value = value

  return $option
}

/**  @returns {HTMLDivElement} */
function createTable() {
  const user = JSON.parse(getUserFromStorage())
  const $container = document.createElement('div')
  $container.className = 'customer-preload__table__container visually-hidden'

  const $selectContainer = document.createElement('div')
  $selectContainer.style =
    'display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1rem;'

  const $buttonsContainer = document.createElement('div')
  $buttonsContainer.style =
    'display: flex; flex-direction: row; align-items: center; gap: 1rem;'

  const $downloadButton = document.createElement('button')
  $downloadButton.className =
    'button-sm bg-secondary-300 bg-hover-secondary-400'
  $downloadButton.innerHTML = '<i class="fa-solid fa-download"></i>'
  $downloadButton.addEventListener('click', () => {
    try {
      downloadPDF('Listado de clientes')
    } catch (error) {
      showToast('No se pudo descargar el listado de clientes')
    }
  })

  const $csvButton = document.createElement('button')
  $csvButton.className = 'button-sm bg-secondary-300 bg-hover-secondary-400'
  $csvButton.id = 'download-csv'
  $csvButton.innerHTML = '.csv'
  $csvButton.addEventListener('click', () => {
    const tableElement = document.querySelector('.fl-table')
    const obj = new csvExport(tableElement)
    const csvData = obj.exportCsv()
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'file.csv'
    a.click()

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 500)
  })

  $buttonsContainer.appendChild($csvButton)
  $buttonsContainer.appendChild($downloadButton)

  const $select = document.createElement('select')
  $select.name = 'selectState'
  $select.id = 'selectState'

  const options = [
    { text: 'Todos', value: '2' },
    { text: 'Pendientes', value: '0' },
    { text: 'Procesados', value: '1' },
  ]

  const $defaultOption = document.createElement('option')
  $defaultOption.textContent = '-- Seleccione --'
  $defaultOption.value = ''
  $defaultOption.selected = true
  $defaultOption.disabled = true
  $select.appendChild($defaultOption)

  options.forEach(option => {
    const $option = createOption(option.text, option.value)
    $select.appendChild($option)
  })

  const $tableContainer = document.createElement('div')
  $tableContainer.className = 'table-container'

  const $table = document.createElement('table')
  $table.className = 'fl-table mt-8'

  const $thead = document.createElement('thead')

  if (user.id === 1) {
    $thead.innerHTML = `
    <tr id="table-row">
      <th scope="col">Cuit</th>
      <th scope="col">Razon Social</th>
      <th scope="col" class="visually-hidden">Telefóno</th>
      <th scope="col" class="visually-hidden">Email</th>
      <th scope="col" class="visually-hidden">Dirección</th>
      <th scope="col">Vendedor</th>
      <th scope="col">Observaciones</th>
      <th scope="col">Estado</th>
      <th scope="col">Acciones</th>
    </tr>
  `
  } else {
    $thead.innerHTML = `
    <tr id="table-row">
      <th scope="col">Cuit</th>
      <th scope="col">Razon Social</th>
      <th scope="col">Telefóno</th>
      <th scope="col">Email</th>
      <th scope="col">Dirección</th>
      <th scope="col">Vendedor</th>
      <th scope="col">Observaciones</th>
      <th scope="col">Estado</th>
    </tr>
  `
  }
  const $tbody = document.createElement('tbody')
  $tbody.id = 'table-body'
  $table.appendChild($thead)
  $table.appendChild($tbody)

  $select.addEventListener('change', async e => {
    const state = e.target.value
    const clients = await getCustomerPreload(user.id === 1 ? 0 : user.id, state)
    renderRows($tbody, clients)
  })

  $container.appendChild($selectContainer)
  $selectContainer.appendChild($select)
  $selectContainer.appendChild($buttonsContainer)
  $tableContainer.appendChild($table)
  $container.appendChild($tableContainer)

  return $container
}

function renderRows(table, clients) {
  table.innerHTML = ''

  if (clients.length > 0) {
    clients.forEach(client => {
      const $row = createRow(client)
      table.appendChild($row)
    })
  } else {
    table.innerHTML = 'No se encontraron resultados.'
  }
}

/** @returns {HTMLTableRowElement} */
function createRow(item) {
  const user = JSON.parse(getUserFromStorage())
  const $row = document.createElement('tr')

  const $cuit = document.createElement('td')
  $cuit.textContent = item.cuit

  const $name = document.createElement('td')
  $name.textContent = item.razonSocial

  const $phone = document.createElement('td')
  $phone.textContent = item.telefono
  $phone.classList.add('visually-hidden')

  const $mail = document.createElement('td')
  $mail.textContent = item.email
  $mail.classList.add('visually-hidden')

  const $address = document.createElement('td')
  $address.textContent = item.direccion
  $address.classList.add('visually-hidden')

  const $seller = document.createElement('td')
  $seller.textContent = item.nombreVendedor

  const $observations = document.createElement('td')
  $observations.textContent = item.observaciones

  const $state = document.createElement('td')
  $state.textContent = item.estado

  const $action = document.createElement('td')
  const $button = document.createElement('button')
  $button.className = 'bg-secondary-300 bg-hover-secondary-400'
  $button.textContent = 'Procesar'
  $button.addEventListener('click', async () => {
    await toggleCustomPreloadState(item)
    showToast('Se ha procesado el pedido')
    renderRows(
      document.querySelector('#table-body'),
      await getCustomerPreload(
        user.id === 1 ? 0 : user.id,
        document.querySelector('#selectState').value
      )
    )
  })

  $action.appendChild($button)

  $row.appendChild($cuit)
  $row.appendChild($name)
  $row.appendChild($phone)
  $row.appendChild($mail)
  $row.appendChild($address)
  $row.appendChild($seller)
  $row.appendChild($observations)
  $row.appendChild($state)
  if (user.id === 1) {
    $row.appendChild($action)
  }

  return $row
}
