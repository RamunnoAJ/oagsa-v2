import { getCategories, getProducts } from '../api/profilePricesList.js'
import * as storage from '../storage/profilePricesList.js'

export const renderProductPrices = async (products, parentElement) => {
  if (products.length > 0) {
    parentElement.innerHTML = `
      <span class="profile-info__subtitle">Lista de Precios</span>
        <form class="profile-info__search search__prices" id="prices-form">

          <select id='select-rubro' name='selectedRubro' class="select bg-primary">
            <option disabled selected value=''>Seleccione un rubro...</option>
            <option value='all'> -- TODOS -- </option>
          </select>

          <select id='select-subrubro' name='selectedSubrubro' class="select bg-primary">
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

    const rubros = await getCategories('articulo/rubros')
    storage.saveRubros(rubros)

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

  if (selectedRubro && selectedSubrubro && selectedSubrubro !== 'all') {
    products = await getProducts(
      `articulo/articulo-rubro?pCodigoRubro=${selectedRubro}&pCodigoSubRubro=${selectedSubrubro}`
    )

    renderPrices(products)
  } else if (selectedRubro || (selectedRubro && selectedSubrubro === 'all')) {
    products = await getProducts(
      `articulo/articulo-rubro?pCodigoRubro=${selectedRubro}`
    )

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
  } else {
    $tableContainer.innerHTML = 'No se encontraron resultados.'
  }
}

const renderOptions = (options, selectID) => {
  const $select = document.querySelector(selectID)

  $select.innerHTML = `<option disabled selected value=''>Seleccione un rubro...</option>
  <option value='all'> -- TODOS -- </option>`

  options.forEach(option => {
    const $option = document.createElement('option')
    if (option.codigoRubro && option.codigoSubRubro) {
      $option.value = option.codigoSubRubro.trim()
      $option.textContent = option.descripcion.trim()
    } else {
      $option.value = option.codigoRubro.trim()
      $option.textContent = option.descripcion.trim()
    }

    $select.appendChild($option)
  })
}

const renderTableRows = async (item, parentElement) => {
  const codigoRubro = item.codigoRubro.trim()
  const codigoSubrubro = item.codigoSubRubro.trim()

  const rubros = storage.getRubros('rubros')
  const subrubros = storage.getSubrubros(codigoRubro)

  const rubro = rubros.filter(rubro => {
    return rubro.codigoRubro === codigoRubro
  })

  const subrubro = subrubros.filter(subrubro => {
    return subrubro.codigoSubRubro === codigoSubrubro
  })

  const tableRow = document.createElement('tr')
  tableRow.innerHTML = `
    <td>${item.codigoArticulo}</td>
    <td>${item.descripcion}</td>
    <td>${item.marca}</td>
    <td>$${item.precio}</td>
    <td>${rubro[0].descripcion}</td>
    <td>${subrubro[0].descripcion}</td>
  `

  parentElement.appendChild(tableRow)
}

const handleChange = async (e, codigoRubro) => {
  e.preventDefault()

  const subrubros = await getCategories(
    `articulo/subrubros?pCodigoRubro=${codigoRubro}`
  )

  storage.saveSubrubros(subrubros, codigoRubro)
  renderOptions(subrubros, '#select-subrubro')
}
