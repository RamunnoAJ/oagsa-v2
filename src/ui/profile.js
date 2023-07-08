import { getUserFromStorage } from '../storage/storageData.js'

export function renderAdminBtn(parentElement) {
  const user = getUserFromStorage()
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
