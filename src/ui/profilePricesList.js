import { getCategories, getProducts } from '../api/profilePricesList.js'
import * as storage from '../storage/profilePricesList.js'
import { removeDuplicates } from '../utils/removeDuplicates.js'

export const renderProductPrices = async (products, parentElement) => {
  if (products.length > 0) {
    parentElement.innerHTML = `
        <form class="profile-info__search search__prices" id="prices-form">
          <div>
            <select id='select-rubro' name='selectedRubro' class="select bg-primary">
              <option disabled selected value=''>Seleccione un rubro...</option>
            </select>

            <select id='select-subrubro' name='selectedSubrubro' class="select bg-primary">
              <option disabled selected value=''>Seleccione un subrubro...</option>
              <option value=''> -- TODOS -- </option>
            </select>
          </div>

          <div>
            <select id='select-brand' name='selectedBrand' class="select bg-primary">
              <option disabled selected value=''>Seleccione una marca...</option>
              <option value=''> -- TODOS -- </option>
            </select>

            <select id='select-diametro' name='selectedDiametro' class="select bg-primary">
              <option disabled selected value=''>Seleccione un diametro...</option>
              <option value=''> -- TODOS -- </option>
            </select>
          </div>

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

    const $form = document.querySelector('#prices-form')
    const $btnSearch = document.querySelector('#btnSearch')
    $form.addEventListener('change', handleChangeForm)
    $btnSearch.addEventListener('click', handleChangeForm)

    const $selectRubro = document.querySelector('#select-rubro')
    const $selectSubrubro = document.querySelector('#select-subrubro')

    $selectSubrubro.addEventListener('change', handleChangeSubrubro)
    $selectRubro.addEventListener('change', e => {
      handleChangeRubro(e, e.target.value)
    })
  } else {
    parentElement.innerHTML = '<div>No se encontraron resultados.</div>'
  }
}

const handleChangeForm = async e => {
  e.preventDefault()
  const $form = document.querySelector('#prices-form')
  const selectedRubro = $form.selectedRubro.value
  const selectedSubrubro = $form.selectedSubrubro.value
  const selectedBrand = $form.selectedBrand.value
  const selectedDiametro = $form.selectedDiametro.value

  let productString = `articulo/articulo-rubro?pCodigoRubro=${selectedRubro}`
  storage.saveProducts(productString)

  if (selectedSubrubro) productString += `&pCodigoSubRubro=${selectedSubrubro}`
  if (selectedBrand) productString += `&pMarca=${selectedBrand}`
  if (selectedDiametro) productString += `&pDiametro=${selectedDiametro}`

  const products = await getProducts(productString)

  renderPrices(products)
}

const renderPrices = products => {
  const $tableContainer = document.querySelector('.table-container')
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

  switch (selectID) {
    case '#select-rubro':
      $select.innerHTML = `<option disabled selected value=''>Seleccione un rubro...</option>`
      break

    case '#select-subrubro':
      $select.innerHTML = `<option disabled selected value=''>Seleccione un subrubro...</option>
      <option value=''> -- TODOS -- </option>`
      break

    case '#select-brand':
      $select.innerHTML = `<option disabled selected value=''>Seleccione una marca...</option>
      <option value=''> -- TODOS -- </option>`
      break

    case '#select-diametro':
      $select.innerHTML = `<option disabled selected value=''>Seleccione un diametro...</option>
      <option value=''> -- TODOS -- </option>`
      break
  }

  const sortedOptions = options.sort((a, b) =>
    a.descripcion.localeCompare(b.descripcion)
  )

  sortedOptions.forEach(option => {
    const $option = document.createElement('option')

    switch (selectID) {
      case '#select-rubro':
        $option.value = option.codigoRubro.trim()
        $option.textContent = option.descripcion.trim()
        break

      case '#select-subrubro':
        $option.value = option.codigoSubRubro.trim()
        $option.textContent = option.descripcion.trim()
        break

      case '#select-brand':
        $option.value = option.descripcion.trim()
        $option.textContent = option.descripcion.trim()
        break

      case '#select-diametro':
        $option.value = option.descripcion.trim()
        $option.textContent = option.descripcion.trim()
        break
    }

    $select.appendChild($option)
  })
}

const renderTableRows = (item, parentElement) => {
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

const handleChangeRubro = async (e, codigoRubro) => {
  e.preventDefault()

  const subrubros = await getCategories(
    `articulo/subrubros?pCodigoRubro=${codigoRubro}`
  )

  storage.saveSubrubros(subrubros, codigoRubro)
  renderOptions(subrubros, '#select-subrubro')
}

const handleChangeSubrubro = async e => {
  e.preventDefault()
  const productString = storage.getProducts()
  const products = await getProducts(productString)

  const marcas = removeDuplicates(products.map(product => product.marca))
  const arrayMarcas = []

  for (let i = 0; i < marcas.length; i++) {
    const marca = { descripcion: marcas[i] }

    if (marca.descripcion.length > 0) {
      arrayMarcas.push(marca)
    }
  }

  const diametros = removeDuplicates(products.map(product => product.diametro))
  const arrayDiametros = []

  for (let i = 0; i < diametros.length; i++) {
    const diametro = { descripcion: diametros[i] }

    if (diametro.descripcion !== '0') {
      arrayDiametros.push(diametro)
    }
  }

  arrayDiametros.sort()

  renderOptions(arrayMarcas, '#select-brand')
  renderOptions(arrayDiametros, '#select-diametro')
}
