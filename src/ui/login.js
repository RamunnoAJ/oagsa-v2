export function renderErrors(errors, parentElement) {
  parentElement.classList.remove('visually-hidden')

  errors.forEach(error => {
    const newError = document.createElement('p')
    newError.textContent = error
    parentElement.appendChild(newError)
  })
}

export function navigateToDashboard() {
  window.location.replace('../pages/dashboard.html')
}

export function navigateToLogin() {
  window.location.replace('../pages/login.html')
}
