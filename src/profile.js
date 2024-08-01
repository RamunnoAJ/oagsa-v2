import { profileAdministration } from './profileAdministration.js'
import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import { profileDrafts } from './profileDrafts.js'
import { profileEditImages } from './profileEditImages.js'
import { profileOrdersHistory } from './profileOrdersHistory.js'
import { profilePricesList } from './profilePricesList.js'
import { profileInterfaceGenerator } from './profileInterfaceGenerator.js'
import { profileCustomerPreload } from './profileCustomerPreload.js'
import { getUserFromStorage } from './storage/storageData.js'
import { navigateToLogin } from './ui/login.js'
import { isMaintaining } from './ui/maintenance.js'
import { renderDashboard, renderTitle } from './ui/profile.js'

const $container = document.querySelector('.dashboard-container')

if (window.location.href.includes('dashboard')) {
  const list = ['Lista de precios']
  const user = JSON.parse(getUserFromStorage())

  if (user.role === 1 || user.role === 2) {
    const newItems = [
      'Lista de clientes',
      'Cuenta corriente',
      'Borrador de pedidos',
      'Historial de pedidos',
      'Precarga de clientes',
    ]

    newItems.forEach(item => {
      list.push(item)
    })
  }

  if (user.role === 1) {
    const newItems = ['Editar imágenes', 'Exportador de Notas', 'Administrar']
    newItems.forEach(item => {
      list.push(item)
    })
  }

  if (user.role === 2) {
    const newItems = ['Información Vendedor']
    newItems.forEach(item => {
      list.push(item)
    })
  }

  await renderDashboard($container, list)

  const $profileList = document.querySelector('#profileList')
  const $profileTitle = document.querySelector('#profileTitle')
  const $profileInfoContainer = document.querySelector('#profileInfoContainer')

  $profileList.addEventListener('click', e => {
    if (e.target.closest('li') === null) return
    renderTitle($profileTitle, e.target.textContent)

    switch ($profileTitle.textContent) {
      case 'Cuenta corriente':
        if (user.role === 1 || user.role === 2) {
          profileClientAccount($profileInfoContainer)
        }
        break

      case 'Lista de clientes':
        if (user.role === 1 || user.role === 2) {
          profileClientList($profileInfoContainer)
        }
        break

      case 'Lista de precios':
        profilePricesList($profileInfoContainer)
        break

      case 'Borrador de pedidos':
        if (user.role === 1 || user.role === 2) {
          profileDrafts($profileInfoContainer)
        }
        break

      case 'Historial de pedidos':
        if (user.role === 1 || user.role === 2) {
          profileOrdersHistory($profileInfoContainer)
        }
        break

      case 'Exportador de Notas':
        if (user.role === 1) {
          profileInterfaceGenerator($profileInfoContainer)
        }
        break

      case 'Editar imágenes':
        if (user.role === 1) {
          profileEditImages($profileInfoContainer)
        }
        break

      case 'Administrar':
        if (user.role === 1) {
          profileAdministration($profileInfoContainer)
        }
        break

      case 'Precarga de clientes':
        if (user.role === 1 || user.role === 2) {
          profileCustomerPreload($profileInfoContainer)
        }
        break

      case 'Información Vendedor':
        if (user.role === 1 || user.role === 2) {
          const user = JSON.parse(getUserFromStorage())
          $profileInfoContainer.innerHTML = `<a href="${user.powerBILink}" target="_blank">Link a Power BI</a>`
        }
        break

      default:
        $profileInfoContainer.innerHTML = ''
        break
    }
  })
}

if (window.location.href.includes('dashboard')) {
  isMaintaining('.dashboard-wrapper')
}

export function logOut() {
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')

  navigateToLogin()
}
