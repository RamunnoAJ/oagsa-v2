import { profileAdministration } from './profileAdministration.js'
import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import { profileDrafts } from './profileDrafts.js'
import { profileEditImages } from './profileEditImages.js'
import { profileOrdersHistory } from './profileOrdersHistory.js'
import { profilePricesList } from './profilePricesList.js'
import { checkLocalStorage } from './storage/profile.js'
import { getUserFromStorage } from './storage/storageData.js'
import { navigateToLogin } from './ui/login.js'
import { isMaintaining } from './ui/maintenance.js'

checkLocalStorage()

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')

if (window.location.href.includes('dashboard')) {
  $profileList.innerHTML = ''
  $profileList.innerHTML += '<li>Lista de precios</li>'

  const user = JSON.parse(getUserFromStorage())

  if (user.role === 1 || user.role === 2) {
    const itemsList = [
      'Lista de clientes',
      'Cuenta corriente',
      'Borrador de pedidos',
      'Historial de pedidos',
    ]

    itemsList.forEach(item => {
      $profileList.innerHTML += `<li>${item}</li>`
    })
  }

  if (user.role === 1) {
    $profileList.innerHTML += `
      <li>Editar imágenes</li>
      <li>Administrar</li>
    `
  }

  $profileList.innerHTML += `<li><a href="./store.html">Tienda</a></li>`

  $profileList.addEventListener('click', e => {
    if (e.target.closest('li') === null) return
    $profileTitle.textContent = e.target.textContent

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
