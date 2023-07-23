import { logOut } from './profile.js'
import { getUserFromStorage } from './storage/storageData.js'

const $accountIcon = document.querySelector('#account-icon')
const user = getUserFromStorage()

if (user) {
  const userFromCookie = JSON.parse(user)

  if (userFromCookie) {
    $accountIcon.innerHTML = `
    <a href="#">
      <span>Salir</span><i class="fa-solid fa-lock-open"></i>
    </a>
    `
  }

  $accountIcon.addEventListener('click', () => {
    logOut()
  })
}
