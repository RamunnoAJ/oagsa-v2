import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import { profilePricesList } from './profilePricesList.js'
import { checkLocalStorage } from './storage/profile.js'
import { navigateToLogin } from './ui/login.js'

import {
  renderAdminBtn,
  renderLogoutBtn,
  renderUserName,
} from './ui/profile.js'

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')
const $btnContainer = document.querySelector('.profile-container__buttons')

renderAdminBtn($btnContainer)
renderLogoutBtn($btnContainer)
const user = checkLocalStorage()
renderUserName(user.id)

const $logoutBtn = document.querySelector('#logout-btn')
$logoutBtn.addEventListener('click', logOut)

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

    default:
      $profileInfoContainer.innerHTML = ''
      break
  }
})

function logOut() {
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')

  navigateToLogin()
}
