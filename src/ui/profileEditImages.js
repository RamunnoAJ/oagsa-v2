import { deleteImage, getArticle, setImage } from '../api/profileEditImages.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'
import { createModal, createOverlay } from './modal.js'
import { showToast } from './cart.js'

export function renderProfileEditImages(parentElement) {
  parentElement.innerHTML = ''

  const $container = document.createElement('div')
  $container.className = 'images-container'

  const $selectContainer = createSelectElement(
    'Imagenes Articulos',
    'articulo',
    handleClick
  )
  $container.appendChild($selectContainer)

  const $imagesContainer = document.createElement('div')
  $imagesContainer.className = 'images-container'
  $imagesContainer.id = 'images-container'

  parentElement.appendChild($container)
  parentElement.appendChild($imagesContainer)
}

function createSelectElement(title, label, callback = () => {}) {
  const $selectContainer = document.createElement('div')
  $selectContainer.className = 'images__select-container'

  const $selectTitle = document.createElement('h2')
  $selectTitle.className = 'images__select__title'
  $selectTitle.textContent = title

  const $selectLabel = document.createElement('label')
  $selectLabel.className = 'images__select__label'
  $selectLabel.textContent = capitalizeFirstLetter(label)
  $selectLabel.htmlFor = label

  const $input = document.createElement('input')
  $input.className = 'images__select'
  $input.id = label
  $input.placeholder = `Ingrese código ${label}`

  const $button = document.createElement('button')
  $button.className = 'button-sm bg-secondary-300 bg-hover-secondary-400 mt-1'
  $button.textContent = 'Buscar'
  $button.addEventListener('click', e => {
    if ($input.value === '') {
      showToast('Ingrese un código')
      return
    }
    callback(e.target.parentNode.querySelector('input').value)
    $input.value = ''
  })

  $selectContainer.appendChild($selectTitle)
  $selectContainer.appendChild($selectLabel)
  $selectContainer.appendChild($input)
  $selectContainer.appendChild($button)

  return $selectContainer
}

async function handleClick(id) {
  if (document.querySelector('.overlay') && document.querySelector('.modal')) {
    document.querySelector('.overlay').remove()
    document.querySelector('.modal').remove()
  }
  const article = await getArticle(id)
  console.log(article)

  renderImages(article)
}

async function renderImages(article) {
  const $container = document.querySelector('#images-container')
  $container.innerHTML = ''
  const $table = await createTable()
  $container.appendChild($table)

  if (article?.url.length === 0) {
    const $row = document.createElement('tr')
    const $paragraph = document.createElement('td')
    $paragraph.colSpan = '2'
    $paragraph.textContent = 'No hay imagenes'
    $row.appendChild($paragraph)
    $table.appendChild($row)
  } else {
    article?.url.forEach(async image => {
      const $row = await createRow(image)
      $table.appendChild($row)
    })
  }

  const $addButton = document.createElement('button')
  $addButton.className = 'button-sm bg-secondary-300 bg-hover-secondary-400'
  $addButton.textContent = 'Agregar'
  $addButton.addEventListener('click', () => {
    renderModalContent(article.codigoArticulo)
  })
  $container.appendChild($addButton)
}

async function renderModalContent(id) {
  const $modal = await createModal()
  const $overlay = await createOverlay()

  const $modalTitle = document.createElement('h2')
  $modalTitle.className = 'modal__title'
  $modalTitle.textContent = `Articulo: ${id}`
  $modal.appendChild($modalTitle)

  const $form = await createModalForm(id)
  $modal.appendChild($form)

  document.body.appendChild($overlay)
  document.body.appendChild($modal)
}

async function handleSubmit(id, $form) {
  try {
    setImage(id, $form.file.files[0]).then(() => {
      showToast('Imagen agregada exitosamente')
      handleClick(id)
    })
  } catch (error) {
    showToast('No se pudo agregar la imagen')
  }
}

async function createModalForm(id) {
  const $form = document.createElement('form')
  $form.className = 'modal__form'
  $form.addEventListener('submit', e => {
    e.preventDefault()
    handleSubmit(id, $form)
  })

  const $container = document.createElement('div')
  $container.className = 'modal__input__container'
  $form.appendChild($container)

  const $label = document.createElement('label')
  $label.className = 'modal__label'
  $label.textContent = 'Elige una imagen'
  $label.htmlFor = 'file'
  $container.appendChild($label)

  const $input = document.createElement('input')
  $input.className = 'modal__input'
  $input.type = 'file'
  $input.name = 'file'
  $container.appendChild($input)

  const $button = document.createElement('button')
  $button.className = 'button-sm bg-secondary-300 bg-hover-secondary-400'
  $button.textContent = 'Agregar'
  $button.type = 'submit'
  $form.appendChild($button)

  return $form
}

async function createRow(image) {
  const $row = document.createElement('tr')
  const $rowTitle = document.createElement('td')
  const lastItem = image.split('\\').pop()
  $rowTitle.textContent = lastItem
  $row.appendChild($rowTitle)

  if (image.includes('G:\\FerozoWebHosting')) {
    image = image
      .split('\\')
      .slice(2)
      .filter(item => {
        return item !== 'public_html'
      })
      .join('\\')
  }

  const $image = document.createElement('td')
  $image.innerHTML = `<img src="https://www.${image}" alt="${image}" class="table__image" />`
  $row.appendChild($image)

  const $delete = document.createElement('td')
  const $deleteBtn = document.createElement('button')
  $deleteBtn.className = 'button-sm bg-secondary-300 bg-hover-error'
  $deleteBtn.textContent = 'Eliminar'
  $deleteBtn.addEventListener('click', () => {
    handleDelete(image.split('\\')[3].split('.')[0].split('-')[0])
  })
  $delete.appendChild($deleteBtn)
  $row.appendChild($delete)

  return $row
}

async function handleDelete(id) {
  await deleteImage(id)
  showToast('Imagen eliminada exitosamente')
  handleClick(id)
}

async function createTable() {
  const $table = document.createElement('table')
  $table.className = 'fl-table'
  $table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Archivo</th>
        <th scope="col">Imagen</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `

  return $table
}
