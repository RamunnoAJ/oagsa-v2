import { getCategories, getProducts } from '../api/profilePricesList.js'
import { checkLocalStorage } from '../storage/profile.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'

checkLocalStorage()

export async function renderClases() {
  const clases = await getCategories('clase/all')

  renderOptions(clases, '#clases')
}

function renderOptions(options, selectID) {
  const $select = document.querySelector(selectID)
  let sortedOptions = []

  switch (selectID) {
    case '#clases':
      sortedOptions = options.sort((a, b) => a.nombre.localeCompare(b.nombre))

      $select.innerHTML = `<option disabled selected value=''>Seleccione una clase</option>`

      sortedOptions.forEach(option => {
        const $option = document.createElement('option')
        $option.value = option.idSuperRubro
        $option.textContent = capitalizeFirstLetter(option.nombre)
        $option.dataset.rubro = option.idSuperRubro
        $select.appendChild($option)
      })
      break
    case '#marcas':
      sortedOptions = options.sort((a, b) => a.localeCompare(b))
      $select.innerHTML = `<option disabled selected value=''>Marca</option>`

      sortedOptions.forEach(marca => {
        const $option = document.createElement('option')
        $option.value = marca
        $option.textContent = capitalizeFirstLetter(marca)
        $select.appendChild($option)
      })
      break
    case '#medidas':
      sortedOptions = options.sort((a, b) => a.localeCompare(b))
      $select.innerHTML = `<option disabled selected value=''>Medida</option>`

      sortedOptions.forEach(medida => {
        if (medida !== 'Sin medidas' && medida) {
          const $option = document.createElement('option')
          $option.value = medida
          $option.textContent = capitalizeFirstLetter(medida)
          $select.appendChild($option)
        }
      })
      break
    case '#diametros':
      sortedOptions = options.sort((a, b) => a.localeCompare(b))
      $select.innerHTML = `<option disabled selected value=''>Diametro</option>`

      sortedOptions.forEach(diametro => {
        if (diametro !== '0' && diametro) {
          const $option = document.createElement('option')
          $option.value = diametro
          $option.textContent = capitalizeFirstLetter(diametro)
          $select.appendChild($option)
        }
      })
  }
}

async function renderRubros(idClase) {
  const $storeRubros = document.querySelector('.store__rubros')
  $storeRubros.innerHTML = `<i class="fa-solid fa-filter"></i>
  <select class="select select-lg bg-primary">
        <option value="" disabled selected>Seleccione un rubro</option>
      </select>`

  $storeRubros.classList.remove('visually-hidden')

  const rubros = await getCategories(`clase/rubro?pIdClase=${idClase}`)
  const $selectRubros = $storeRubros.querySelector('select')

  rubros.forEach(rubro => {
    const $option = document.createElement('option')
    $option.classList = 'store__rubros__item bg-primary'
    $option.textContent = capitalizeFirstLetter(rubro.descripcion.toLowerCase())
    $option.value = rubro.codigoRubro
    $option.dataset.rubro = rubro.codigoRubro

    $selectRubros.appendChild($option)
  })

  $selectRubros.addEventListener('change', e => {
    renderInputs(e.target.value)
  })
}

const $select = document.querySelector('#clases')
$select.addEventListener('change', e => {
  renderRubros(e.target.value)
})

const renderInputs = async (codigoRubro = '') => {
  const $storeRubros = document.querySelector('.store__rubros')
  const $storeSearchInput = document.querySelector('.store__search__input')

  $storeRubros.classList.remove('visually-hidden')
  $storeSearchInput.classList.remove('visually-hidden')

  const products = await getProducts(`precio/rubro?pCodigoRubro=${codigoRubro}`)

  const marcas = products.map(product => product.marca)
  const uniqueMarcas = [...new Set(marcas)]

  renderOptions(uniqueMarcas, '#marcas')

  const medidas = products.map(product => product.medidas)
  const uniqueMedidas = [...new Set(medidas)]

  renderOptions(uniqueMedidas, '#medidas')

  const diametros = products.map(product => product.diametro)
  const uniqueDiametros = [...new Set(diametros)]

  renderOptions(uniqueDiametros, '#diametros')
}
