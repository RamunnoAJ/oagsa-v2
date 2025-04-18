import {
  downloadExcel,
  getBrands,
  getCategories,
  getProducts,
} from '../api/profilePricesList.js'
import * as storage from '../storage/profilePricesList.js'
import { removeDuplicates } from '../utils/removeDuplicates.js'
import { showToast } from '../utils/showToast.js'
import { formatter } from '../utils/formatPrice.js'
import { downloadPDF } from '../utils/downloadPDF.js'
import { csvExport } from '../entities/csv.js'
import { ArticlePrice } from '../entities/prices.js'
import { defaultImage } from './cart.js'

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

          <div class="discount-container">
            <input type="number" id="discount" name="discount" min="0" max="100" class="select bg-primary" placeholder="Ingrese un descuento">
            <span class="percentage">%</span>
          </div>

          <div>
            <button class="button bg-secondary-300 bg-hover-secondary-400" id="btnDownload" type="button">
              <span class="visually-hidden-mobile">Descargar .pdf</span>
              <span class="visually-hidden-desktop">
                <i class="fa-solid fa-download"></i>
              </span>
            </button>
            <button class="button bg-secondary-300 bg-hover-secondary-400" id="csvDownload" type="button" >
                    Descargar .csv
            </button>
            <button class="button bg-secondary-300 bg-hover-secondary-400" id="excelDownload" type="button">
                    Descargar excel
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
        /** @type {string} */
        let downloadMessage =
          $form.selectedRubro.querySelector('option:checked').textContent
        if ($form.discount.value)
          downloadMessage += ` - Descuento: ${$form.discount.value}%`

        downloadPDF(
          `Lista de precios ${
            downloadMessage.includes('Seleccione')
              ? ''
              : ' - ' + downloadMessage
          }`
        )
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

    const $csvDownload = document.querySelector('#csvDownload')
    $csvDownload.addEventListener('click', () => {
      const tableElement = document.querySelector('.fl-table')
      const obj = new csvExport(tableElement)
      const csvData = obj.exportCsv()
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Precio de listas - ${
        new Date().toISOString().split('T')[0]
      }`
      a.click()

      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 500)
    })

    const $excelDownload = document.querySelector('#excelDownload')
    $excelDownload.addEventListener('click', () => {
      const $codigoClase = document.querySelector('#select-clase').value || '0'
      const $codigoRubro = document.querySelector('#select-rubro').value || ''
      const $codigoSubrubro =
        document.querySelector('#select-subrubro').value || ''
      const $codigoMarca = document.querySelector('#select-brand').value || ''
      const $codigoDiametro =
        document.querySelector('#select-diametro').value || ''
      const $codigoMedida = document.querySelector('#select-medida').value || ''
      const $codigoDescuento = document.querySelector('#discount').value || '0'

      let titulo = $codigoClase
      let fetchString = `precio/descarga-excel?pCodigoClase=${$codigoClase}`
      if ($codigoRubro) {
        fetchString += `&pCodigoRubro=${$codigoRubro}`
        titulo += `-${$codigoRubro}`
      }
      if ($codigoSubrubro) {
        fetchString += `&pCodigoSubRubro=${$codigoSubrubro}`
        titulo += `-${$codigoSubrubro}`
      }
      if ($codigoMarca) {
        fetchString += `&pMarca=${$codigoMarca}`
        titulo += `-${$codigoMarca}`
      }
      if ($codigoDiametro) {
        fetchString += `&pDiametro=${$codigoDiametro}`
        titulo += `-${$codigoDiametro}`
      }
      if ($codigoMedida) {
        fetchString += `&pMedida=${$codigoMedida}`
        titulo += `-${$codigoMedida}`
      }

      titulo += `-descuento ${$codigoDescuento}`
      fetchString += `&pDescuento=${$codigoDescuento}`

      downloadExcel(fetchString, titulo)
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
  const selectedDiscount = $form.discount.value

  let productString = ''

  if (selectedClase)
    productString += `precio/clase-rubro-subrubro?pCodigoClase=${selectedClase}`
  if (selectedRubro) productString += `&pCodigoRubro=${selectedRubro}`
  if (selectedSubrubro) productString += `&pCodigoSubRubro=${selectedSubrubro}`
  if (selectedBrand) productString += `&pMarca=${selectedBrand}`
  if (selectedDiametro) productString += `&pDiametro=${selectedDiametro}`
  if (selectedMedida) productString += `&pMedida=${selectedMedida}`
  if (selectedDiscount) productString += `&pDescuento=${selectedDiscount}`
  storage.saveProducts(productString)

  if (productString === '') return
  return await getProducts(productString)
}

async function handleChangeForm(e) {
  e.preventDefault()
  const products = await getProductsForm()
  if (!products) return
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
      <th scope="col">Imagen</th>
      <th scope="col">Artículo</th>
      <th scope="col">Descripción</th>
      <th scope="col">Marca</th>
      <th scope="col">Precio</th>
      <th scope="col" class="visually-hidden-mobile">% Desc.</th>
      <th scope="col">Precio Desc.</th>
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

  const sortedOptions = options.sort(
    (a, b) => a.name?.localeCompare(b.name) || a
  )

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
        $option.value = option.name?.trim() || option.nombreMarca?.trim()
        $option.textContent = option.name?.trim() || option.nombreMarca?.trim()
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

/**
 * @param {ArticlePrice} item
 */
function renderTableRows(item, parentElement) {
  const tableRow = document.createElement('tr')
  const image =
    item.images[0]
      ?.split('FerozoWebHosting\\')[1]
      .split('\\')
      .filter(e => e !== 'public_html')
      .join('\\') || ''
  const imageUrl = 'https://' + image

  tableRow.innerHTML = `
    <td class="text-start"><img class="w-32" src=${
      image ? imageUrl : defaultImage
    } /></td>
    <td class="text-start">${item.id}</td>
    <td class="text-start">${item.name}</td>
    <td class="text-start">${item.brand}</td>
    <td class="text-end">${formatter.format(
      item.price < 0 ? item.price.toFixed(0) * -1 : item.price.toFixed(0) || 0
    )}</td>
    <td class="text-end visually-hidden-mobile">${item.discount}</td>
    <td class="text-end">${formatter.format(
      item.priceDiscount < 0
        ? item.priceDiscount.toFixed(0) * -1
        : item.priceDiscount.toFixed(0) || 0
    )}</td>
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

  const marcas = await getBrands(`articulo/marcas?pClase=${clase}`)
  renderOptions(marcas, '#select-brand')
}
