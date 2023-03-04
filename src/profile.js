import { profileClientAccount } from './profileClientAccount.js'
import { profileClientList } from './profileClientList.js'

const $profileTitle = document.querySelector('#profileTitle')
const $profileList = document.querySelector('#profileList')
const $profileInfoContainer = document.querySelector('#profileInfoContainer')

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
