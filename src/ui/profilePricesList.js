import { getCategories, getProducts } from '../api/profilePricesList.js'
import * as storage from '../storage/profilePricesList.js'
import { removeDuplicates } from '../utils/removeDuplicates.js'
import { showToast } from '../utils/showToast.js'
import { formatter } from '../utils/formatPrice.js'
import { downloadPDF } from '../utils/downloadPDF.js'

export async function renderProductPrices(products, parentElement) {
  if (products.length > 0) {
    parentElement.innerHTML = `
        <form class="profile-info__search search__prices" id="prices-form">
          <div>
            <select id='select-clase' name='selectedClase' class='select bg-primary'>
              <option disabled selected value=''>Seleccione una clase...</option>
              <option value=''> -- TODOS -- </option>
            </select>
            <select id='select-rubro' name='selectedRubro' class="select bg-primary">
              <option disabled selected value=''>Seleccione un rubro...</option>
            </select>
          </div>

          <div>
            <select id='select-subrubro' name='selectedSubrubro' class="select bg-primary">
              <option disabled selected value=''>Seleccione un subrubro...</option>
              <option value=''> -- TODOS -- </option>
            </select>
            <select id='select-brand' name='selectedBrand' class="select bg-primary">
              <option disabled selected value=''>Seleccione una marca...</option>
              <option value=''> -- TODOS -- </option>
            </select>
          </div>

          <div>
            <select id='select-diametro' name='selectedDiametro' class="select bg-primary">
              <option disabled selected value=''>Seleccione un diametro...</option>
              <option value=''> -- TODOS -- </option>
            </select>
            <select id='select-medida' name='selectedMedida' class="select bg-primary">
              <option disabled selected value=''>Seleccione una medida...</option>
              <option value=''> -- TODOS -- </option>
            </select>
          </div>

          <div>
            <button class="button bg-secondary-300 bg-hover-secondary-400" id="btnDownload">
              <span class="visually-hidden-mobile">Descargar</span>
              <span class="visually-hidden-desktop">
                <i class="fa-solid fa-download"></i>
              </span>
            </button>
          </div>
        </form>

        <div class="table-container"></div>
    `

    const $selectClases = document.querySelector('#select-clase')
    $selectClases.addEventListener('change', handleSelectClases)

    const clases = await getCategories('clase/all')
    storage.saveClases(clases)
    await renderOptions(clases, '#select-clase')

    const $form = document.querySelector('#prices-form')
    $form.addEventListener('change', handleChangeForm)

    const $btnDownload = document.querySelector('#btnDownload')
    $btnDownload.addEventListener('click', e => {
      e.preventDefault()
      try {
        const selectedOption =
          $form.selectedRubro.querySelector('option:checked').textContent

        downloadPDF(selectedOption)
      } catch (error) {
        showToast('Debes seleccionar alguna tabla para descargar')
      }
    })

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

async function getProductsForm() {
  const $form = document.querySelector('#prices-form')
  const selectedClase = $form.selectedClase.value
  const selectedRubro = $form.selectedRubro.value
  const selectedSubrubro = $form.selectedSubrubro.value
  const selectedBrand = $form.selectedBrand.value
  const selectedDiametro = $form.selectedDiametro.value
  const selectedMedida = $form.selectedMedida.value

  let productString = `articulo/articulo-clase?pCodigoClase=${selectedClase}`
  storage.saveProducts(productString)

  if (selectedClase)
    productString += `precio/clase-rubro-subrubro?pCodigoClase=${selectedClase}`
  if (selectedRubro) productString += `&pCodigoRubro=${selectedRubro}`
  if (selectedSubrubro) productString += `&pCodigoSubRubro=${selectedSubrubro}`
  if (selectedBrand) productString += `&pMarca=${selectedBrand}`
  if (selectedDiametro) productString += `&pDiametro=${selectedDiametro}`
  if (selectedMedida) productString += `&pMedida=${selectedMedida}`

  return await getProducts(productString)
}

async function handleChangeForm(e) {
  e.preventDefault()
  const products = await getProductsForm()
  renderPrices(products)
}

function renderPrices(products) {
  const $tableContainer = document.querySelector('.table-container')
  $tableContainer.innerHTML = ''

  if (products.length > 0) {
    const $table = createTable()

    $tableContainer.appendChild($table)
    const $tableBody = document.querySelector('#table-body')
    products.forEach(product => {
      renderTableRows(product, $tableBody)
    })
  } else {
    $tableContainer.innerHTML = 'No se encontraron resultados.'
  }
}

function createTable() {
  const table = document.createElement('table')
  table.classList.add('fl-table')
  table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">Artículo</th>
      <th scope="col">Descripción</th>
      <th scope="col">Marca</th>
      <th scope="col">Precio</th>
      <th scope="col">% Desc.</th>
      <th scope="col">Precio Desc.</th>
      <th scope="col" class="visually-hidden-mobile">Diametro</th>
      <th scope="col" class="visually-hidden-mobile">Medidas</th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>
  `

  return table
}

async function renderOptions(options, selectID) {
  const $select = document.querySelector(selectID)

  switch (selectID) {
    case '#select-clase':
      $select.innerHTML = `<option disabled selected value=''>Seleccione una clase...</option>`
      break

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

    case '#select-medida':
      $select.innerHTML = `<option disabled selected value=''>Seleccione una medida...</option>
      <option value=''> -- TODOS -- </option>`
      break
  }

  const sortedOptions = options.sort((a, b) => a.name.localeCompare(b.name))

  sortedOptions.forEach(option => {
    const $option = document.createElement('option')

    switch (selectID) {
      case '#select-clase':
        $option.value = option.id.trim()
        $option.textContent = option.name.trim()
        $option.dataset.name = option.name.trim()
        break

      case '#select-rubro':
        $option.value = option.id.trim()
        $option.textContent = option.name.trim()
        $option.dataset.name = option.name.trim()
        break

      case '#select-subrubro':
        $option.value = option.id.trim()
        $option.textContent = option.name.trim()
        break

      case '#select-brand':
        $option.value = option.name.trim()
        $option.textContent = option.name.trim()
        break

      case '#select-diametro':
        $option.value = option.name.trim()
        $option.textContent = option.name.trim()
        break

      case '#select-medida':
        $option.value = option.name.trim()
        $option.textContent = option.name.trim()
        break
    }

    $select.appendChild($option)
  })
}

function renderTableRows(item, parentElement) {
  const tableRow = document.createElement('tr')

  tableRow.innerHTML = `
    <td class="text-start">${item.id}</td>
    <td class="text-start">${item.name}</td>
    <td class="text-start">${item.brand}</td>
    <td class="text-end">${formatter.format(item.price?.toFixed(0) || 0)}</td>
    <td class="text-end">${item.discount}</td>
    <td class="text-end">${formatter.format(
      item.priceDiscount?.toFixed(0) || 0
    )}</td>
    <td class="visually-hidden-mobile text-end">${item.diameter}</td>
    <td class="visually-hidden-mobile text-end">${item.measure}</td>
  `

  parentElement.appendChild(tableRow)
}

async function handleChangeRubro(e, codigoRubro) {
  e.preventDefault()

  const subrubros = await getCategories(
    `articulo/subrubros?pCodigoRubro=${codigoRubro}`
  )

  const products = await getProductsForm()

  storage.saveSubrubros(subrubros, codigoRubro)
  renderOptions(subrubros, '#select-subrubro')

  const { arrayMarcas, arrayDiametros, arrayMedidas } = await renderSelects(
    products
  )

  renderOptions(arrayMarcas, '#select-brand')
  renderOptions(arrayDiametros, '#select-diametro')
  renderOptions(arrayMedidas, '#select-medida')
}

async function renderSelects(products) {
  const marcas = removeDuplicates(products.map(product => product.brand))
  const arrayMarcas = []

  for (let i = 0; i < marcas.length; i++) {
    const marca = { name: marcas[i] }

    if (marca.name.length > 0) {
      arrayMarcas.push(marca)
    }
  }

  const diametros = removeDuplicates(products.map(product => product.diameter))
  const arrayDiametros = []

  for (let i = 0; i < diametros.length; i++) {
    const diametro = { name: diametros[i] }

    if (diametro.name !== '0') {
      arrayDiametros.push(diametro)
    }
  }

  arrayDiametros.sort()

  const medidas = removeDuplicates(products.map(product => product.measure))
  const arrayMedidas = []

  for (let i = 0; i < medidas.length; i++) {
    const medida = { name: medidas[i] }

    if (medida.name !== '0' && medida.name !== 'Sin medidas') {
      arrayMedidas.push(medida)
    }
  }

  return { arrayMarcas, arrayDiametros, arrayMedidas }
}

async function handleChangeSubrubro(e) {
  e.preventDefault()
  const products = await getProductsForm()

  const { arrayMarcas, arrayDiametros, arrayMedidas } = renderSelects(products)

  renderOptions(arrayMarcas, '#select-brand')
  renderOptions(arrayDiametros, '#select-diametro')
  renderOptions(arrayMedidas, '#select-medida')
}

async function handleSelectClases(e) {
  e.preventDefault()
  const clase = e.target.querySelector('option:checked').value

  const rubros = await getCategories(`clase/rubro?pIdClase=${clase}`)
  renderOptions(rubros, '#select-rubro')
}
