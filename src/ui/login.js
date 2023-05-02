export function renderErrors(errors, $errorContainer) {
  $errorContainer.classList.remove('visually-hidden')

  errors.forEach(error => {
    const newError = document.createElement('p')
    newError.textContent = error
    $errorContainer.appendChild(newError)
  })
}

export function navigateToDashboard() {
  window.location.replace('../pages/dashboard.html')
}
