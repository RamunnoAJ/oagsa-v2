import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import getDataFromDB from './utils/getDataFromDB.js'

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')
const $btnContainer = document.querySelector('.profile-container__buttons')
const $profileName = document.querySelector('#profile-name')

const localStorageID = Number(localStorage.getItem('sessionID'))
const localStorageSession = Number(localStorage.getItem('session'))

const sessionStorageID = Number(sessionStorage.getItem('sessionID'))
const sessionStorageSession = Number(sessionStorage.getItem('session'))

renderAdminBtn()
renderLogoutBtn()

const $logoutBtn = document.querySelector('#logout-btn')
$logoutBtn.addEventListener('click', logOut)

if (localStorageID === 0 && sessionStorageID === 0) {
  window.location.replace('../pages/log-in.html')
}

if (sessionStorageID) {
  renderUserName(sessionStorageID)
}
if (localStorageID) {
  renderUserName(localStorageID)
}

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

    default:
      $profileInfoContainer.innerHTML = ''
      break
  }
})

function renderLogoutBtn() {
  const logoutBtn = document.createElement('button')
  logoutBtn.classList.add(
    'button',
    'text-black',
    'bg-secondary-300',
    'bg-hover-secondary-400',
    'uppercase'
  )
  logoutBtn.id = 'logout-btn'
  logoutBtn.innerHTML = `log out <i
  class="fa-solid fa-power-off"></i>`
  $btnContainer.appendChild(logoutBtn)
}

function renderAdminBtn() {
  if (localStorageSession === 1 || sessionStorageSession === 1) {
    const adminBtn = document.createElement('p')
    adminBtn.classList.add('button', 'bg-white', 'bg-hover-slate', 'uppercase')
    adminBtn.textContent = 'Admin'
    $btnContainer.appendChild(adminBtn)
  }
}

function logOut() {
  localStorage.removeItem('sessionID')
  localStorage.removeItem('session')
  sessionStorage.removeItem('sessionID')
  sessionStorage.removeItem('session')

  window.location.replace('../pages/log-in.html')
}

async function renderUserName(id) {
  const response = await getDataFromDB(
    `http://api.oagsa.com/api/vendedor/vendedor?pVendedor=${id}`
  )
  const clientName = await response.data.razonSocial

  if (clientName) {
    $profileName.textContent = clientName
  }
}
