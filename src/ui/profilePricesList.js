import { getCategories, getProducts } from '../api/profilePricesList.js'

export const renderProductPrices = async (products, parentElement) => {
  if (products.length > 0) {
    parentElement.innerHTML = `
      <span class="profile-info__subtitle">Lista de Precios</span>
        <form class="profile-info__search" id="prices-form">

          <select id='select-rubro' name='selectedRubro'>
            <option disabled selected value=''>Seleccione un rubro...</option>
            <option value='all'> -- TODOS -- </option>
          </select>

          <select id='select-subrubro' name='selectedSubrubro'>
            <option disabled selected value=''>Seleccione un subrubro...</option>
            <option value='all'> -- TODOS -- </option>
          </select>

          <button class="button bg-secondary-300 bg-hover-secondary-400" id="btnSearch">
            <span class="visually-hidden-mobile">Buscar</span>
            <span class="visually-hidden-desktop">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
          </button>
        </form>

        <div class="table-container"></div>
    `

    const rubros = await getCategories('clase/all')

    renderOptions(rubros, '#select-rubro')

    const $selectRubro = document.querySelector('#select-rubro')

    $selectRubro.addEventListener('change', e => {
      handleChange(e, e.target.value)
    })

    const $btnSearch = document.querySelector('#btnSearch')
    $btnSearch.addEventListener('click', handleSubmit)
  } else {
    parentElement.innerHTML = '<div>No se encontraron resultados.</div>'
  }
}

const handleSubmit = async e => {
  e.preventDefault()
  const $form = document.querySelector('#prices-form')
  const selectedRubro = $form.selectedRubro.value
  const selectedSubrubro = $form.selectedSubrubro.value

  let products

  if (selectedRubro && selectedSubrubro) {
    products = await getProducts(
      `articulo-rubro?pCodigoRubro=${selectedRubro}&pCodigoSubRubro=${selectedSubrubro}`
    )

    renderPrices(products)
  } else if (selectedRubro) {
    products = await getProducts(`articulo-rubro?pCodigoRubro=${selectedRubro}`)

    renderPrices(products)
  }
}

const renderPrices = async products => {
  parent.innerHTML = ''
  const $tableContainer = document.querySelector('.table-container')
  $tableContainer.innerHTML = '<span class="loader"></span>'

  $tableContainer.innerHTML = ''

  if (products.length > 0) {
    const table = document.createElement('table')
    table.classList.add('fl-table')
    table.innerHTML = `
    <thead>
      <tr>
        <th>Artículo</th>
        <th>Descripción</th>
        <th>Marca</th>
        <th>Precio</th>
        <th>Rubro</th>
        <th>Subrubro</th>
      </tr>
    </thead>
    <tbody id='table-body'>
    
    </tbody>
    `

    $tableContainer.appendChild(table)
    const $tableBody = document.querySelector('#table-body')

    products.forEach(product => {
      renderTableRows(product, $tableBody)
    })
  }
}

const renderOptions = (options, selectID) => {
  const $select = document.querySelector(selectID)

  options.forEach(option => {
    const $option = document.createElement('option')
    if (option.idSuperRubro) {
      $option.value = option.idSuperRubro.trim()
      $option.textContent = option.nombre.trim()
    } else if (option.codigoRubro && option.codigoSubRubro) {
      $option.value = option.codigoSubRubro.trim()
      $option.textContent = option.descripcion.trim()
    } else {
      $option.value = option.codigoRubro.trim()
      $option.textContent = option.descripcion.trim()
    }

    $select.appendChild($option)
  })
}

const renderTableRows = (item, parentElement) => {
  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
    <td>${item.nombre}</td>
    <td>${item.descripcion}</td>
    <td>${item.marca}</td>
    <td>${item.precio}</td>
    <td>${item.rubro}</td>
    <td>${item.subrubro}</td>
  `

  parentElement.appendChild(tableRow)
}

const handleChange = async (e, subrubro) => {
  e.preventDefault()

  const categories = await getCategories(
    `articulo/subrubros?pCodigoRubro=${subrubro}`
  )

  console.log(categories)

  renderOptions(categories, '#select-subrubro')
}
