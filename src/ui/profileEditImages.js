import { getArticle } from '../api/profileEditImages.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'

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
    callback(e.target.parentNode.querySelector('input'))
    $input.value = ''
  })

  $selectContainer.appendChild($selectTitle)
  $selectContainer.appendChild($selectLabel)
  $selectContainer.appendChild($input)
  $selectContainer.appendChild($button)

  return $selectContainer
}

async function handleClick(input) {
  const article = await getArticle(input.value)

  renderImages(article)
}

async function renderImages(article) {
  const $container = document.querySelector('#images-container')
  $container.innerHTML = ''
  const $table = await createTable()
  $container.appendChild($table)

  article.url.forEach(async image => {
    const $row = await createRow(image)
    $table.appendChild($row)
  })
}

async function createRow(image) {
  const $row = document.createElement('tr')
  $row.innerHTML = `
    <td>${image.split('\\')[3]}</td>
    <td><img src="https://www.${image}" alt="${image}" class="table__image" /></td>
    <td><button class="button-sm bg-slate bg-hover-error">Eliminar</button></td>
  `

  return $row
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
