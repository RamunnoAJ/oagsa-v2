import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import { checkLocalStorage } from './storage/profile.js'

import { renderAdminBtn, renderLogoutBtn } from './ui/profile.js'
import getDataFromDB from './utils/getDataFromDB.js'

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')
const $btnContainer = document.querySelector('.profile-container__buttons')
const $profileName = document.querySelector('#profile-name')

renderAdminBtn($btnContainer)
renderLogoutBtn($btnContainer)
checkLocalStorage()

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
      break

    default:
      $profileInfoContainer.innerHTML = ''
      break
  }
})

function logOut() {
  localStorage.removeItem('sessionID')
  localStorage.removeItem('session')
  sessionStorage.removeItem('sessionID')
  sessionStorage.removeItem('session')

  window.location.replace('../pages/log-in.html')
}

export async function renderUserName(id) {
  const response = await getDataFromDB(
    `http://api.oagsa.com/api/vendedor/vendedor?pVendedor=${id}`
  )
  const clientName = await response.data.razonSocial

  if (clientName) {
    $profileName.textContent = clientName
  }
}
