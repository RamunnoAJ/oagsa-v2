import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')
const $logoutBtn = document.querySelector('#logout-btn')

const localStorageID = Number(localStorage.getItem('sessionID'))
const sessionStorageID = Number(sessionStorage.getItem('sessionID'))

if (localStorageID === 0 && sessionStorageID === 0) {
  window.location.replace('../pages/log-in.html')
}

const logOut = () => {
  localStorage.removeItem('sessionID')
  sessionStorage.removeItem('sessionID')

  window.location.replace('../pages/log-in.html')
}

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

    case 'Precarga de clientes':
      break
    default:
      $profileInfoContainer.innerHTML = ''
      break
  }
})
