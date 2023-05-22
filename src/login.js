import { getUserLogin } from './api/login.js'
import { checkLocalStorage } from './storage/login.js'
import { navigateToDashboard, renderErrors } from './ui/login.js'

const $form = document.querySelector('#login-form')
const $errorContainer = document.querySelector('#error-container')

const handleSubmit = async e => {
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
      id: loggedUser.codigoBejerman,
      role: loggedUser.nivelAcceso,
      checkbox,
    }
    const cookieValue = JSON.stringify(user)
    console.log(cookieValue)
    if (checkbox) {
      document.cookie = `user=${cookieValue}; max-age=360000000; secure; path=/`
    } else {
      document.cookie = `user=${cookieValue}; max-age=3600; secure; path=/`
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

checkLocalStorage()
