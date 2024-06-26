/**
 * @param {string[]} errors
 * @param {HTMLElement} parentElement
 * */
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

export function navigateToStore() {
  window.location.replace('../pages/store.html')
}

export function navigateToLogin() {
  window.location.replace('../pages/log-in.html')
}
