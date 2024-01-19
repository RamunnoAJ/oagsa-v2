import { postCustomerPreload } from '../api/profileCustomerPreload.js'
import { getUserFromStorage } from '../storage/storageData.js'
import { showToast } from '../utils/showToast.js'

/** @param {HTMLElement} parentElement  */
export function renderCustomerPreload(parentElement) {
  parentElement.innerHTML = ''

  const $container = document.createElement('div')
  $container.className = 'customer-preload__container'

  const $nav = document.createElement('ul')
  $nav.className = 'customer-preload__header'

  const $navItem = document.createElement('li')
  $navItem.className = 'customer-preload__header__item active'
  $navItem.innerText = 'Formulario de altas'

  const $navItem2 = document.createElement('li')
  $navItem2.className = 'customer-preload__header__item'
  $navItem2.innerText = 'Listado'

  const $customerPreload = createForm()

  const $customerTable = document.createElement('table')
  $customerTable.className = 'customer-preload__list visually-hidden'
  $customerTable.innerText = 'lista'

  $navItem.addEventListener('click', () => {
    $customerPreload.classList.remove('visually-hidden')
    $navItem.classList.add('active')
    $customerTable.classList.add('visually-hidden')
    $navItem2.classList.remove('active')
  })

  $navItem2.addEventListener('click', () => {
    $customerPreload.classList.add('visually-hidden')
    $navItem2.classList.add('active')
    $customerTable.classList.remove('visually-hidden')
    $navItem.classList.remove('active')
  })

  $nav.appendChild($navItem)
  $nav.appendChild($navItem2)
  $container.appendChild($nav)
  $container.appendChild($customerPreload)
  $container.appendChild($customerTable)
  parentElement.appendChild($container)
}

/** @returns {HTMLFormElement} */
function createForm() {
  const $form = document.createElement('form')
  $form.className = 'customer-preload__form'

  const $name = createField('text', 'name', 'Razón social', false, true)
  $form.appendChild($name)

  const $address = createField('text', 'address', 'Dirección')
  $form.appendChild($address)

  const $city = createField('text', 'city', 'Localidad')
  $form.appendChild($city)

  const $zip = createField('text', 'zip', 'Código postal')
  $form.appendChild($zip)

  const $phone = createField('text', 'phone', 'Teléfono')
  $form.appendChild($phone)

  const $email = createField('text', 'email', 'Email')
  $form.appendChild($email)

  const $cuit = createField('text', 'cuit', 'Cuit', false, true)
  $form.appendChild($cuit)

  const $observations = createField(
    'text',
    'observations',
    'Observaciones',
    true
  )
  $form.appendChild($observations)

  const $submit = document.createElement('button')
  $submit.className = 'customer-preload__form__submit'
  $submit.type = 'submit'
  $submit.textContent = 'Grabar'

  $form.appendChild($submit)
  $form.addEventListener('submit', handleSubmitForm)

  return $form
}

async function handleSubmitForm(e) {
  e.preventDefault()

  const $form = e.target
  const $name = $form.name
  const $address = $form.address
  const $city = $form.city
  const $zip = $form.zip
  const $phone = $form.phone
  const $email = $form.email
  const $cuit = $form.cuit
  const $observations = $form.observations

  const user = JSON.parse(getUserFromStorage())

  await postCustomerPreload('clienteprecarga', {
    razonSocial: $name.value,
    direccion: $address.value,
    localidad: $city.value,
    codigoPostal: $zip.value,
    telefono: $phone.value,
    email: $email.value,
    codigoVendedor: user.id,
    cuit: $cuit.value,
    observaciones: $observations.value,
    nombreVendedor: '',
    leido: 0,
    estado: '',
  })

  showToast(`Se ha guardado correctamente el cliente ${$name.value}`)
}

/** @param {string} type
 * @param {string} name
 * @param {string} label
 * @param {boolean} textarea
 * @param {boolean} required
 * @returns {HTMLDivElement}
 */
function createField(type, name, label, textarea = false, required = false) {
  const $field = document.createElement('div')
  $field.className = 'customer-preload__form__field'

  const $label = document.createElement('label')
  $label.className = 'customer-preload__form__label'
  $label.textContent = label
  $label.htmlFor = `form-preload-${name}`

  $field.appendChild($label)

  if (textarea) {
    $label.className = 'customer-preload__form__label--textarea'
    $field.className = 'customer-preload__form__field--textarea'

    const $textarea = document.createElement('textarea')
    $textarea.className = 'customer-preload__form__textarea'
    $textarea.id = `form-preload-${name}`
    $textarea.name = name

    $field.appendChild($textarea)
  } else {
    const $input = document.createElement('input')
    $input.className = 'customer-preload__form__input'
    $input.type = type
    $input.name = name
    $input.id = `form-preload-${name}`
    $input.required = required

    $field.appendChild($input)
  }

  return $field
}
