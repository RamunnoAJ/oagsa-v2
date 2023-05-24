import getCookie from '../storage/storageData.js'
import getDataFromDB from '../utils/getDataFromDB.js'

const $profileName = document.querySelector('#profile-name')

export function renderLogoutBtn(parentElement) {
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
  parentElement.appendChild(logoutBtn)
}

export function renderAdminBtn(parentElement) {
  const user = getCookie('user')
  if (user) {
    const userFromCookie = JSON.parse(user)

    if (userFromCookie) {
      if (userFromCookie.role === 1) {
        const adminBtn = document.createElement('p')
        adminBtn.classList.add(
          'button',
          'bg-white',
          'bg-hover-slate',
          'uppercase'
        )
        adminBtn.textContent = 'Admin'
        parentElement.appendChild(adminBtn)
      }
    }
  }
}

export async function renderUserName(id) {
  const response = await getDataFromDB(`vendedor/vendedor?pVendedor=${id}`)
  const clientName = await response.data.razonSocial

  if (clientName) $profileName.textContent = clientName
}
