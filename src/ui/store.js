import { getCategories } from '../api/profilePricesList.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'

export async function renderClases() {
  const clases = await getCategories('clase/all')

  renderOptions(clases, '#clases')
}

function renderOptions(options, selectID) {
  const $select = document.querySelector(selectID)
  const sortedOptions = options.sort((a, b) => a.nombre.localeCompare(b.nombre))

  $select.innerHTML = `<option disabled selected value=''>Seleccione una clase</option>`

  sortedOptions.forEach(option => {
    const $option = document.createElement('option')
    $option.value = option.idSuperRubro
    $option.textContent = option.nombre
    $option.dataset.rubro = option.idSuperRubro
    $select.appendChild($option)
  })
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
}

const $select = document.querySelector('#clases')
$select.addEventListener('change', e => {
  renderRubros(e.target.value)
})
