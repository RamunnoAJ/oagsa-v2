export function renderAdminBtn(parentElement) {
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
