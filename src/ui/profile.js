import {
  localStorageSession,
  sessionStorageSession,
} from '../storage/storageData.js'

export function renderLogoutBtn($btnContainer) {
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

export function renderAdminBtn($btnContainer) {
  if (localStorageSession === 1 || sessionStorageSession === 1) {
    const adminBtn = document.createElement('p')
    adminBtn.classList.add('button', 'bg-white', 'bg-hover-slate', 'uppercase')
    adminBtn.textContent = 'Admin'
    $btnContainer.appendChild(adminBtn)
  }
}
