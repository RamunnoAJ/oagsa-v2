import { getCategories, getProducts } from '../api/profilePricesList.js'
import { checkLocalStorage } from '../storage/profile.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'
import * as storage from '../storage/store.js'

checkLocalStorage()

const $form = document.querySelector('#store')
$form.addEventListener('change', handleChangeForm)
$form.addEventListener('submit', handleSubmitSearch)

const $searchInput = document.querySelector('#searchByCode')
$searchInput.addEventListener('submit', handleSubmitSearch)

const $rubrosImages = document.querySelector('.grid-store')
$rubrosImages.addEventListener('click', e => {
  if (
    e.target.closest('div') === null ||
    !e.target.closest('div').className.includes('grid__image')
  )
    return

  renderRubrosDesktop(e.target.closest('div').dataset.rubro)
})

async function handleChangeForm(e) {
  e.preventDefault()

  let selectedSubrubro = ''

  if ($form.rubros) {
    selectedSubrubro = $form.rubros.value
  } else {
    selectedSubrubro = document.querySelector(
      '.store__rubros__desktop__items.active'
    ).dataset.rubro
  }

  const selectedMarca = await $form.marca.value
  const selectedDiametro = await $form.diametro.value
  const selectedMedida = await $form.medida.value

  let productsString = `articulo/articulo-rubro?pCodigoRubro=${selectedSubrubro}`

  if (selectedSubrubro) {
    if (selectedMarca) {
      productsString += `&pMarca=${selectedMarca}`
    }
    if (selectedDiametro) {
      productsString += `&pDiametro=${selectedDiametro}`
    }
    if (selectedMedida) {
      productsString += `&pMedida=${selectedMedida}`
    }

    const products = await getProducts(productsString)
    storage.saveToLocalStorage('products_store', products)
    renderProducts(products)
  }
}

async function handleSubmitSearch(e) {
  e.preventDefault()
  const searchValue = e.target.querySelector('#searchByCode').value
  const products = storage.getFromLocalStorage('products_store')

  const newProducts = products.filter(product => {
    return product.codigoArticulo.includes(searchValue)
  })

  renderProducts(newProducts)
}

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

      $select.innerHTML = `<option disabled selected value=''>Seleccione una clase</option>
      <option value=''>-- TODOS --</option>
      `

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
      $select.innerHTML = `<option disabled selected value=''>Marca</option>
      <option value=''>-- TODOS --</option>`

      sortedOptions.forEach(marca => {
        const $option = document.createElement('option')
        $option.value = marca
        $option.textContent = capitalizeFirstLetter(marca)
        $select.appendChild($option)
      })
      break
    case '#medidas':
      sortedOptions = options.sort((a, b) => a.localeCompare(b))
      $select.innerHTML = `<option disabled selected value=''>Medida</option>
      <option value=''>-- TODOS --</option>`

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
      $select.innerHTML = `<option disabled selected value=''>Diametro</option>
      <option value=''>-- TODOS --</option>`

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
  <select class="select select-lg bg-primary" name="rubros" id="rubros">
        <option value="" disabled selected>Seleccione un rubro</option>
      </select>`

  $storeRubros.classList.add('select-store')
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

async function renderRubrosDesktop(idClase) {
  const $storeRubros = document.querySelector('.store__rubros')
  $storeRubros.innerHTML = `<span class="loader"></span>`

  $storeRubros.classList.remove('visually-hidden')
  $storeRubros.classList.remove('select-store')

  const rubros = await getCategories(`clase/rubro?pIdClase=${idClase}`)
  $storeRubros.innerHTML = `<div class="store__rubros__desktop"></div>`
  const $storeRubrosDesktop = $storeRubros.querySelector(
    '.store__rubros__desktop'
  )

  rubros.forEach(rubro => {
    const $option = document.createElement('span')
    $option.classList =
      'store__rubros__desktop__items bg-primary bg-hover-secondary-300'
    $option.textContent = capitalizeFirstLetter(rubro.descripcion.toLowerCase())
    $option.value = rubro.codigoRubro
    $option.dataset.rubro = rubro.codigoRubro
    $option.addEventListener('click', highlightRubro)

    $storeRubrosDesktop.appendChild($option)
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

const renderProducts = async products => {
  const $storeProducts = document.querySelector('.store__products')
  $storeProducts.innerHTML = `<span class="loader"></span>`

  if (products.length > 0) {
    $storeProducts.innerHTML = ''
    products.forEach(product => {
      renderProductCard(product, $storeProducts)
    })
  } else {
    $storeProducts.innerHTML = 'No hay productos para mostrar'
  }
}

const renderProductCard = (item, parentElement) => {
  const $card = document.createElement('article')
  $card.classList = 'store__product__card'
  let image = item.url[0]

  if (!image) {
    image = switchImage(item.codigoRubro.trim())
  }

  $card.innerHTML = `<img src="${'https://' + image}" alt="${
    item.descripcion
  }" class="store__product__card__image">
  <div class="store__product__card__info">
    <h3 class="fw-bold">${item.descripcion}</h3>
    <div>
      <span>${item.codigoArticulo}</span>
      <span class="fw-bold">$${item.precio}</span>
    </div>
    <p>Unidades en stock <span>${item.stockUnidades}</span></span></p>
    <input type="number" id="quantity-${item.codigoArticulo}" min="1" max="${
    item.stockUnidades
  }" placeholder="Ingrese cantidad">
    <button class="button-sm bg-secondary-300 bg-hover-secondary-400 mt-2">Añadir al carro <i class="fa-solid fa-cart-plus"></i></button>
  </div>
  `

  parentElement.appendChild($card)
}

async function highlightRubro(e) {
  const $rubros = document.querySelectorAll('.store__rubros__desktop__items')
  $rubros.forEach(rubro => rubro.classList.remove('active'))
  e.target.classList.add('active')

  const $selectedSubrubro = document.querySelector(
    '.store__rubros__desktop__items.active'
  )
  renderInputs($selectedSubrubro.dataset.rubro)

  const selectedSubrubro = $selectedSubrubro.dataset.rubro

  let productsString = `articulo/articulo-rubro?pCodigoRubro=${selectedSubrubro}`

  const selectedMarca = $form.marca.value
  const selectedDiametro = $form.diametro.value
  const selectedMedida = $form.medida.value

  if (selectedSubrubro) {
    if (selectedMarca) {
      productsString += `&pMarca=${selectedMarca}`
    }
    if (selectedDiametro) {
      productsString += `&pDiametro=${selectedDiametro}`
    }
    if (selectedMedida) {
      productsString += `&pMedida=${selectedMedida}`
    }

    const products = await getProducts(productsString)
    storage.saveToLocalStorage('products_store', products)
    renderProducts(products)
  }
}

function switchImage(condition) {
  switch (condition) {
    case 'U001':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2011%20-%20HERRAMIENTA.png?alt=media&token=b06bbe3a-cd7e-4a80-a4e7-3bccb9a8df33&_gl=1*15t1cdf*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NTk4MzMyMC4yLjEuMTY4NTk4NDI0Ny4wLjAuMA'

    case 'U002':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2021%20-%20CASCO%20MOTO.png?alt=media&token=35372e86-cd9c-4142-9987-8922bf8a5bc7&_gl=1*1xq7zgf*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU5OC4wLjAuMA..'

    case 'O001':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%20%2017%20-%20LUBRICANTE.png?alt=media&token=96998bf8-ecfd-42e4-b05c-8a65967df918&_gl=1*71q4za*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU3MS4wLjAuMA..'
    case 'R001':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..'

    case 'R040':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..'

    case 'R057':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..'

    case 'R058':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..'

    case 'Z001':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..'

    case 'W100':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%20%2017%20-%20LUBRICANTE.png?alt=media&token=96998bf8-ecfd-42e4-b05c-8a65967df918&_gl=1*71q4za*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU3MS4wLjAuMA..'

    case 'C039':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2019%20-%20CASCOS%20BICI.png?alt=media&token=b056c059-b7b7-434a-87fa-14380ec41cf7&_gl=1*1piegc8*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU5My4wLjAuMA..'

    case 'F240':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..'

    case 'F700':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..'

    case 'F800':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%201%20-%20BICICLETA.png?alt=media&token=ee32880e-5be8-4ba8-9e88-89e510546bce&_gl=1*19kjrha*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU3Ni4wLjAuMA..'

    case 'V001':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..'

    case 'P090':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..'

    case 'P100':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..'

    case 'P400':
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..'

    default:
      return 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2015%20-%20CUBIERTA%20DE%20BICI.png?alt=media&token=b11b4ad8-3be2-4636-bca7-fff24f31e36c&_gl=1*as18e2*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4OC4wLjAuMA..'
  }
}
