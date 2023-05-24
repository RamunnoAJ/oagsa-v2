import getCookie from './storage/storageData.js'

const currentURL = window.location.href
const $accountIcon = document.querySelector('#account-icon')
const user = getCookie('user')

let buttonURL = './pages/dashboard.html'

if (currentURL.includes('/pages/')) {
  buttonURL = './dashboard.html'
}

if (user) {
  const userFromCookie = JSON.parse(user)

  if (userFromCookie) {
    $accountIcon.innerHTML = `
    <div>
    <button class="button button-sm mt-1 bg-white bg-hover-slate"><i class="fa-solid fa-envelope"></i></button>
    <a href=${buttonURL} class="button button-sm mt-1 bg-secondary-300 bg-hover-secondary-400 text-black"><i class="fa-solid fa-user"></i></a>
    </div>
    `
  }
}
