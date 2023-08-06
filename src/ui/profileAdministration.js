import { postDolar } from '../api/dolar.js'
import { setMaintenance } from '../api/maintenance.js'

export async function renderProfileAdministration(
  dolar,
  maintenance,
  parentElement
) {
  parentElement.innerHTML = ''
  const $container = document.createElement('div')
  $container.className = 'admin-container'

  parentElement.appendChild($container)

  const $maintenance = await createMaintenanceElement(
    maintenance?.valorString.trim()
  )
  $container.appendChild($maintenance)

  const $dolar = await createDolarElement(dolar, postDolar)
  $container.appendChild($dolar)
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
  $dolarTitle.textContent = 'Dolar'
  $dolar.appendChild($dolarTitle)

  const $dolarBody = document.createElement('div')
  $dolarBody.className = 'dolar__body'
  $dolar.appendChild($dolarBody)

  const $dolarInput = document.createElement('input')
  $dolarInput.className = 'dolar__input'
  $dolarInput.type = 'number'
  $dolarInput.value = dolar.valorString.trim()
  $dolarInput.addEventListener('change', e => {
    callback(e.target.value)
  })

  $dolarBody.appendChild($dolarInput)

  return $dolar
}
