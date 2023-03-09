import getDataFromDB from './utils/getDataFromDB.js'

const $form = document.querySelector('#login-form')
const $errorContainer = document.querySelector('#error-container')

const localStorageID = Number(localStorage.getItem('sessionID'))
const sessionStorageID = Number(sessionStorage.getItem('sessionID'))

if (localStorageID !== 0 || sessionStorageID !== 0) {
  window.location.replace('../pages/dashboard.html')
}

const handleSubmit = e => {
  e.preventDefault()
  $errorContainer.innerHTML = ''
  $errorContainer.classList.add('visually-hidden')

  const user = $form.user.value
  const password = $form.password.value
  const checkbox = $form.checkbox.checked

  const errors = validateLogin(user, password)

  if (errors.length > 0) {
    renderErrors(errors)
    return
  }

  getDataFromDB(
    `http://api.oagsa.com/api/login/login?pUsuario=${user}&pPassword=${password}`
  ).then(({ data }) => {
    if (data) {
      if (checkbox) {
        localStorage.setItem('sessionID', data.id)
        localStorage.setItem('session', data.nivelAcceso)
      } else {
        sessionStorage.setItem('sessionID', data.id)
        sessionStorage.setItem('session', data.nivelAcceso)
      }

      navigateToDashboard()
    } else {
      errors.push('Usuario o contraseña incorrectos')
      renderErrors(errors)
    }
  })
}

$form.addEventListener('submit', handleSubmit)

function validateLogin(user, password) {
  const errors = []
  $form.user.style.border = 'none'
  $form.password.style.border = 'none'

  if (user.length === 0) {
    errors.push('El campo usuario no puede estar vacío')
    $form.user.style.border = '1px solid red'
  }

  if (password.length === 0) {
    errors.push('El campo contraseña no puede estar vacío')
    $form.password.style.border = '1px solid red'
  }

  return errors
}

function renderErrors(errors) {
  $errorContainer.classList.remove('visually-hidden')

  errors.forEach(error => {
    const newError = document.createElement('p')
    newError.textContent = error
    $errorContainer.appendChild(newError)
  })
}

function navigateToDashboard() {
  window.location.replace('../pages/dashboard.html')
}
