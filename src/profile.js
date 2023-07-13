import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'
import { profileDrafts } from './profileDrafts.js'
import { profilePricesList } from './profilePricesList.js'
import { checkLocalStorage } from './storage/profile.js'
import { getUserFromStorage } from './storage/storageData.js'
import { navigateToLogin } from './ui/login.js'

checkLocalStorage()

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')


if (window.location.href.includes('dashboard')) {
  $profileList.innerHTML = ''
  $profileList.innerHTML += '<li>Cuenta corriente</li>'

  const user = JSON.parse(getUserFromStorage())

  if (user.role === 1) {
    const itemsList = ['Lista de clientes', 'Lista de precios', 'Borrador de pedidos']

    itemsList.forEach(item => {
      $profileList.innerHTML += `<li>${item}</li>`
    })
  }

  $profileList.innerHTML += `<li><a href="./store.html">Tienda</a></li>`

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
