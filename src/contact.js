import { BASE_URL } from './utils/getDataFromDB.js'

const $form = document.querySelector('#contact-form')
$form.addEventListener('submit', event => {
  event.preventDefault()

  const formData = {
    nombre: event.target.name.value,
    apellido: event.target.surname.value,
    empresa: event.target.company.value,
    eMail: event.target.email.value,
    localidad: event.target.location.value,
    telefono: event.target.phone.value,
    mensaje: event.target.message.value,
  }

  try {
    postEmail(formData)
    $form.reset()
    validateForm(formData)
    showMessage('Mensaje enviado correctamente', false)
  } catch (e) {
    showMessage('Hubo un error enviando el mensaje', true)
  }
})

function postEmail(data) {
  fetch(`${BASE_URL}admin/enviar-mail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => console.log(response))
}

/**
 * @param {string} message
 * @param {boolean} isError
 */
function showMessage(message, isError) {
  const $message = document.createElement('p')
  $message.textContent = message
  if (isError) {
    $message.style.color = 'red'
  } else {
    $message.style.color = 'green'
  }

  $form.append($message)

  setTimeout(() => {
    $message.remove()
  }, 3000)
}

function validateForm(data) {
  if (data.name === '') {
    showMessage('El campo nombre es obligatorio', true)
    document.querySelector('#name').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#name').style.border = 'none'
    })
    throw new Error('El campo nombre es obligatorio')
  }

  if (data.surname === '') {
    showMessage('El campo apellido es obligatorio', true)
    document.querySelector('#surname').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#surname').style.border = 'none'
    })
    throw new Error('El campo apellido es obligatorio')
  }

  if (data.email === '') {
    showMessage('El campo email es obligatorio', true)
    document.querySelector('#email').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#email').style.border = 'none'
    })
    throw new Error('El campo email es obligatorio')
  }

  if (data.message === '') {
    showMessage('El campo mensaje es obligatorio', true)
    document.querySelector('#message').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#message').style.border = 'none'
    })
    throw new Error('El campo mensaje es obligatorio')
  }

  if (data.company === '') {
    showMessage('El campo empresa es obligatorio', true)
    document.querySelector('#company').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#company').style.border = 'none'
    })
    throw new Error('El campo empresa es obligatorio')
  }

  if (data.location === '') {
    showMessage('El campo localidad es obligatorio', true)
    document.querySelector('#location').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#location').style.border = 'none'
    })
    throw new Error('El campo localidad es obligatorio')
  }

  if (data.phone === '') {
    showMessage('El campo telefono es obligatorio', true)
    document.querySelector('#phone').style.border = '1px solid red'
    setTimeout(() => {
      document.querySelector('#phone').style.border = 'none'
    })
    throw new Error('El campo telefono es obligatorio')
  }
}
