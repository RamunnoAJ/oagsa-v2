import { getMaintenance } from '../api/maintenance.js'
import { getUserFromStorage } from '../storage/storageData.js'

export async function isMaintaining(parentElement) {
  const maintenance = await getMaintenance()
  const user = JSON.parse(getUserFromStorage())
  if (maintenance?.value.trim() === 'True' && user?.role !== 1) {
    renderMaintainancePage(parentElement)
  }
  return false
}

async function renderMaintainancePage(parentElement) {
  const $parent = document.querySelector(parentElement)
  $parent.innerHTML = ''
  const $maintenance = await createMaintancePage()
  $parent.appendChild($maintenance)
}

async function createMaintancePage() {
  const $maintenance = document.createElement('div')
  $maintenance.className = 'maintaining'

  const $maintenanceImage = document.createElement('img')
  $maintenanceImage.className = 'maintaining__image'
  $maintenanceImage.src = '../assets/maintenance.svg'

  const $maintenanceSubtitle = document.createElement('span')
  $maintenanceSubtitle.className = 'maintaining__subtitle'
  $maintenanceSubtitle.textContent = 'Volveremos pronto'

  const $maintenanceTitle = document.createElement('h2')
  $maintenanceTitle.className = 'maintaining__title'
  $maintenanceTitle.textContent = 'El sitio web está bajo mantenimiento!'

  const $maintenanceText = document.createElement('p')
  $maintenanceText.className = 'maintaining__text'
  $maintenanceText.textContent =
    'Parece que hubo un error con nuestra página, estamos trabajando 24/7 para resolver este inconveniente.'

  $maintenance.appendChild($maintenanceImage)
  $maintenance.appendChild($maintenanceSubtitle)
  $maintenance.appendChild($maintenanceTitle)
  $maintenance.appendChild($maintenanceText)

  return $maintenance
}
