import { postDolar } from '../api/dolar.js'
import { setMaintenance } from '../api/maintenance.js'
import { formatter } from '../utils/formatPrice.js'

export async function renderProfileAdministration(
  dolar,
  maintenance,
  parentElement
) {
  parentElement.innerHTML = ''
  const $container = document.createElement('div')
  $container.className = 'admin-container'

  parentElement.appendChild($container)

  const $maintenance = await createMaintenanceElement(maintenance?.value.trim())
  $container.appendChild($maintenance)

  const $dolar = await createDolarElement(dolar, postDolar)
  $container.appendChild($dolar)

  //const $surpassLimit = createSurpassStock()
  //$container.appendChild($surpassLimit)
}

async function createMaintenanceElement(maintenance) {
  const $maintenance = document.createElement('div')
  $maintenance.className = 'maintenance'

  const $maintenanceTitle = document.createElement('h2')
  $maintenanceTitle.className = 'maintenance__title'
  $maintenanceTitle.textContent = 'Sitio en mantenimiento'
  $maintenance.appendChild($maintenanceTitle)

  renderButtons(maintenance, setMaintenance, $maintenance)

  return $maintenance
}

function renderButtons(maintenance, callback, parentElement) {
  const $maintenanceBody = document.createElement('div')
  $maintenanceBody.className = 'maintenance__body'
  parentElement.appendChild($maintenanceBody)

  const $maintenanceBtnYes = document.createElement('button')
  $maintenanceBtnYes.className =
    'button bg-secondary-300 bg-hover-secondary-400'
  $maintenanceBtnYes.textContent = 'Si'

  const $maintenanceBtnNo = document.createElement('button')
  $maintenanceBtnNo.className = 'button bg-secondary-300 bg-hover-secondary-400'
  $maintenanceBtnNo.textContent = 'No'

  if (maintenance === 'True') {
    $maintenanceBtnYes.classList.add('maintenance__selected')
  } else {
    $maintenanceBtnNo.classList.add('maintenance__selected')
  }

  $maintenanceBtnNo.addEventListener('click', () => {
    callback()
    toggleClass($maintenanceBtnYes, 'maintenance__selected')
    toggleClass($maintenanceBtnNo, 'maintenance__selected')
  })

  $maintenanceBtnYes.addEventListener('click', () => {
    callback()
    toggleClass($maintenanceBtnYes, 'maintenance__selected')
    toggleClass($maintenanceBtnNo, 'maintenance__selected')
  })

  $maintenanceBody.appendChild($maintenanceBtnYes)
  $maintenanceBody.appendChild($maintenanceBtnNo)
}

function toggleClass(element, className) {
  element.classList.toggle(className)
}

async function createDolarElement(dolar, callback) {
  const $dolar = document.createElement('div')
  $dolar.className = 'dolar'

  const $dolarTitle = document.createElement('h2')
  $dolarTitle.className = 'dolar__title'
  $dolarTitle.textContent = 'Cotización dolar'
  $dolar.appendChild($dolarTitle)

  const $dolarBody = document.createElement('div')
  $dolarBody.className = 'dolar__body'
  $dolar.appendChild($dolarBody)

  const $dolarValue = document.createElement('div')
  $dolarValue.className = 'dolar__value'
  $dolarValue.textContent = `Valor actual: ${formatter.format(
    dolar.value.trim()
  )}`

  const $form = document.createElement('form')
  $form.className = 'dolar__input-container'

  const $dolarLabel = document.createElement('label')
  $dolarLabel.className = 'dolar__label'
  $dolarLabel.textContent = 'Cambiar valor:'
  $dolarLabel.htmlFor = 'dolar'
  $form.appendChild($dolarLabel)

  const $dolarInput = document.createElement('input')
  $dolarInput.className = 'dolar__input'
  $dolarInput.type = 'number'
  $dolarInput.id = 'dolar'
  $dolarInput.name = 'dolar'
  $dolarInput.min = 1
  $form.appendChild($dolarInput)

  const $formSubmit = document.createElement('button')
  $formSubmit.className =
    'button-sm bg-white bg-hover-secondary-400 dolar__submit'
  $formSubmit.textContent = 'Guardar'
  $form.appendChild($formSubmit)

  $form.addEventListener('submit', e => {
    e.preventDefault()
    callback($form.dolar.value)
    $dolarValue.textContent = `Valor actual: $${$form.dolar.value}`
    $dolarInput.value = ''
  })

  $dolarBody.appendChild($dolarValue)
  $dolarBody.appendChild($form)

  return $dolar
}

function createSurpassStock() {
  const $container = document.createElement('div')
  $container.className = 'maintenance'

  const $title = document.createElement('h2')
  $title.className = 'maintenance__title'
  $title.textContent = 'Sobrepasar stock en la tienda'
  $container.appendChild($title)

  const $surpassBody = document.createElement('div')
  $surpassBody.className = 'maintenance__body'
  $container.appendChild($surpassBody)

  const $surpassYesBtn = document.createElement('button')
  $surpassYesBtn.className = 'button bg-secondary-300 bg-hover-secondary-400'
  $surpassYesBtn.textContent = 'Si'

  const $surpassNoBtn = document.createElement('button')
  $surpassNoBtn.className = 'button bg-secondary-300 bg-hover-secondary-400'
  $surpassNoBtn.textContent = 'No'

  if (true === 'True') {
    $surpassYesBtn.classList.add('maintenance__selected')
  } else {
    $surpassNoBtn.classList.add('maintenance__selected')
  }

  $surpassNoBtn.addEventListener('click', () => {
    callback()
    toggleClass($surpassYesBtn, 'maintenance__selected')
    toggleClass($surpassNoBtn, 'maintenance__selected')
  })

  $surpassYesBtn.addEventListener('click', () => {
    callback()
    toggleClass($surpassYesBtn, 'maintenance__selected')
    toggleClass($surpassNoBtn, 'maintenance__selected')
  })

  $surpassBody.appendChild($surpassYesBtn)
  $surpassBody.appendChild($surpassNoBtn)

  $container.appendChild($surpassBody)

  return $container
}
