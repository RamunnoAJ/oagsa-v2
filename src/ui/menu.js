const $btnMenu = document.querySelector('.btn-menu')
const $body = document.body
const $navBar = document.querySelector('.nav-bar')

$btnMenu.addEventListener('click', () => {
  $body.classList.toggle('menu-open')
  $navBar.classList.toggle('active')
})
