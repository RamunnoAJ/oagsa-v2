import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import { profileDrafts } from './profileDrafts.js'
import { profilePricesList } from './profilePricesList.js'
import { navigateToLogin } from './ui/login.js'

import {
  renderAdminBtn,
  renderUserName,
} from './ui/profile.js'

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')
const $btnContainer = document.querySelector('.profile-container__buttons')

if (window.location.href.includes('dashboard')) {
  renderAdminBtn($btnContainer)
  renderUserName()

  $profileList.addEventListener('click', e => {
    if (e.target.closest('li') === null) return
    $profileTitle.textContent = e.target.textContent

    switch ($profileTitle.textContent) {
      case 'Cuenta corriente':
        profileClientAccount($profileInfoContainer)
        break

      case 'Lista de clientes':
        profileClientList($profileInfoContainer)
        break

      case 'Lista de precios':
        profilePricesList($profileInfoContainer)
        break

      case 'Borrador de pedidos':
        profileDrafts($profileInfoContainer)
        break

      default:
        $profileInfoContainer.innerHTML = ''
        break
    }
  })
}

export function logOut() {
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')

  navigateToLogin()
}
