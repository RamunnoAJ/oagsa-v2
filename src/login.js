import { getUserLogin } from './api/login.js'
import { checkLocalStorage } from './storage/login.js'
import { navigateToDashboard, renderErrors } from './ui/login.js'

await checkLocalStorage()

const $form = document.querySelector('#login-form')
const $errorContainer = document.querySelector('#error-container')

async function handleSubmit(e) {
  e.preventDefault()
  $errorContainer.innerHTML = ''
  $errorContainer.classList.add('visually-hidden')

  const username = $form.user.value
  const password = $form.password.value
  const checkbox = $form.checkbox.checked

  const errors = validateLogin(username, password)

  if (errors.length > 0) {
    renderErrors(errors)
    return
  }

  const loggedUser = await getUserLogin(username, password)

  if (loggedUser) {
    const user = {
      id: loggedUser.id,
      role: loggedUser.role,
      name: loggedUser.name,
      checkbox,
    }
    if (checkbox) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.setItem('user', JSON.stringify(user))
    }

    navigateToDashboard()
  } else {
    errors.push('Usuario o contraseña incorrectos')
    renderErrors(errors, $errorContainer)
  }
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
