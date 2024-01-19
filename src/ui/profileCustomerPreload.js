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

  const $customerPreload = document.createElement('div')
  $customerPreload.className = 'customer-preload__form'

  const $form = createForm()
  $customerPreload.appendChild($form)

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

  const $name = createField('text', 'name', 'Razón social')
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

  const $cuit = createField('text', 'cuit', 'Cuit')
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
  $form.addEventListener('submit', e => {
    e.preventDefault()
    handleSubmit($form)
  })

  return $form
}

/** @param {string} type
 * @param {string} name
 * @param {string} label
 * @returns {HTMLDivElement}
 */
function createField(type, name, label, textarea = false) {
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

    $field.appendChild($input)
  }

  return $field
}
