import { getUserFromStorage } from '../storage/storageData.js'

const $btnMenu = document.querySelector('.btn-menu')
const $body = document.body
const $navBar = document.querySelector('.nav-bar')

$btnMenu.addEventListener('click', () => {
  $body.classList.toggle('menu-open')
  $navBar.classList.toggle('active')
})

const user = JSON.parse(getUserFromStorage())
displayUsername(user?.name)

/**
 * @param {string} username
 * */
export async function displayUsername(username = '') {
  const $navbar = document.querySelector('.nav-bar > .nav-flex')
  const $name = document.createElement('li')
  $name.className = 'text-dark-grey username text-sm max-w-40 truncate'
  $name.innerHTML = `<i class="fa-solid fa-user"></i> ${username}`
  if (!username) {
    $name.classList.add('visually-hidden')
  }

  $navbar.appendChild($name)
}
