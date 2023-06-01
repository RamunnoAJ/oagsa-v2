import { getCategories } from '../api/profilePricesList.js'

export async function renderClases() {
  const clases = await getCategories('clase/all')

  renderOptions(clases, '#clases')
}

function renderOptions(options, selectID) {
  const $select = document.querySelector(selectID)
  const sortedOptions = options.sort((a, b) => a.nombre.localeCompare(b.nombre))

  $select.innerHTML = `<option disabled selected value=''>Seleccione un rubro...</option>`

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
  $storeRubros.innerHTML = ''

  const rubros = await getCategories(`clase/rubro?pIdClase=${idClase}`)
  console.log(rubros)

  rubros.forEach(rubro => {
    const $rubro = document.createElement('li')
    $rubro.classList = 'store__rubros__item bg-primary fw-bold'
    $rubro.textContent = rubro.descripcion
    $rubro.dataset.rubro = rubro.codigoRubro

    $storeRubros.appendChild($rubro)
  })
}

const $select = document.querySelector('#clases')
$select.addEventListener('change', e => {
  renderRubros(e.target.value)
})
