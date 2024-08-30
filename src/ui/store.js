import { getCategories } from '../api/profilePricesList.js'
import { getProducts } from '../api/store.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'
import * as storage from '../storage/store.js'
import { addToCart } from '../cart.js'
import { sortProducts } from '../utils/sortProducts.js'
import { getDolar } from '../api/dolar.js'
import { getUserFromStorage } from '../storage/storageData.js'
import { ArticleOrder } from '../entities/articles.js'
import { showToast } from '../utils/showToast.js'
import { formatter } from '../utils/formatPrice.js'

const $form = document.querySelector('#store')
$form.addEventListener('change', handleChangeForm)
$form.addEventListener('submit', handleSubmitSearch)
const $selects = $form.querySelectorAll('.select-store')
$selects.forEach(select => {
  select.addEventListener('change', handleChangeSelect)
})

const $searchInput = document.querySelector('#searchByCode')
$searchInput.addEventListener('submit', handleSubmitSearch)

function handleChangeSelect(e) {
  const $parentForm = e.target.parentNode.parentNode.parentNode.parentNode
  const selectedClase = $parentForm.clases.value
  const selectedRubro = $parentForm.rubros.value

  renderInputs(selectedClase, selectedRubro)
}

async function handleChangeForm(e) {
  e.preventDefault()

  let selectedClase = ''
  let selectedRubro = ''

  if ($form.clases) {
    selectedClase = $form.clases.value
  } else {
    selectedClase = document.querySelector(
      '.store__clases__desktop__items.active'
    ).dataset.clase
  }

  if ($form.rubros) {
    selectedRubro = $form.rubros.value
  } else {
    selectedRubro = document.querySelector(
      '.store__rubros__desktop__items.active'
    ).dataset.rubro
  }

  const selectedMarca = await $form.marca.value
  const selectedDiametro = await $form.diametro.value
  const selectedMedida = await $form.medida.value

  let productsString = `articulo/articulo-clase?pCodigoClase=${selectedClase}`

  if (selectedClase) {
    if (selectedRubro) {
      productsString += `&pCodigoRubro=${selectedRubro}`
    }

    if (selectedMarca) {
      productsString += `&pMarca=${selectedMarca}`
    }
    if (selectedDiametro) {
      productsString += `&pDiametro=${selectedDiametro}`
    }
    if (selectedMedida) {
      productsString += `&pMedida=${selectedMedida}`
    }

    const user = JSON.parse(getUserFromStorage())
    productsString += `&pNivleUsuario=${user?.role || 2}`

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
    return product.id.includes(searchValue)
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
      sortedOptions = options.sort((a, b) => a.name.localeCompare(b.name))

      $select.innerHTML = `<option disabled selected value=''>Seleccione una clase</option>`

      sortedOptions.forEach(option => {
        const $option = document.createElement('option')
        $option.value = option.id
        $option.textContent = capitalizeFirstLetter(option.name)
        $option.dataset.rubro = option.id
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
    $option.textContent = capitalizeFirstLetter(rubro.name.toLowerCase())
    $option.value = rubro.id
    $option.dataset.rubro = rubro.id

    $selectRubros.appendChild($option)
  })
}

const $select = document.querySelector('#clases')
$select.addEventListener('change', e => {
  renderRubros(e.target.value)
})

const renderInputs = async (codigoClase, codigoRubro = '') => {
  const $storeRubros = document.querySelector('.store__rubros')
  const $storeSearchInput = document.querySelector('.store__search__input')

  $storeRubros.classList.remove('visually-hidden')
  $storeSearchInput.classList.remove('visually-hidden')

  let productsString = `articulo/articulo-clase?pCodigoClase=${codigoClase}`
  if (codigoRubro) productsString += `&pCodigoRubro=${codigoRubro}`

  const products = await getProducts(productsString)

  const marcas = products.map(product => product.brand)
  const uniqueMarcas = [...new Set(marcas)]

  renderOptions(uniqueMarcas, '#marcas')

  const medidas = products.map(product => product.measure)
  const uniqueMedidas = [...new Set(medidas)]

  renderOptions(uniqueMedidas, '#medidas')

  const diametros = products.map(product => product.diameter)
  const uniqueDiametros = [...new Set(diametros)]

  renderOptions(uniqueDiametros, '#diametros')
}

const renderProducts = async products => {
  const $storeProducts = document.querySelector('.store__products')
  $storeProducts.innerHTML = `<span class="loader"></span>`

  if (products.length > 0) {
    $storeProducts.innerHTML = ''
    sortProducts(products)

    products.forEach(product => {
      renderProductCard(product, $storeProducts)
    })
  } else {
    $storeProducts.innerHTML = '<p>No hay productos para mostrar</p>'
  }

  if ($storeProducts.querySelectorAll('.store__product__card').length === 0) {
    $storeProducts.innerHTML = '<p>No hay productos para mostrar</p>'
  }
}

function renderProductCard(item, parentElement) {
  const user = getUserFromStorage()
  const $card = createProductCard(item, user)

  parentElement.appendChild($card)
}

function createProductCard(item, user) {
  const $card = document.createElement('article')
  $card.classList = 'store__product__card'
  let image = item.images[0]

  if (!image) {
    image = switchImage(item.idCategory.trim())
  }

  const $image = document.createElement('img')
  $image.src = 'https://' + image
  $image.alt = item.name
  $image.classList = 'store__product__card__image'
  $card.appendChild($image)

  const $info = document.createElement('div')
  $info.classList = 'store__product__card__info'
  $card.appendChild($info)

  const $title = document.createElement('h3')
  $title.textContent = item.name
  $info.appendChild($title)

  const $article = document.createElement('span')
  $article.style = 'font-style: italic;'
  $article.textContent = item.id
  $info.appendChild($article)

  const $price = document.createElement('div')
  if (user) $info.appendChild($price)

  const $priceValue = document.createElement('span')
  $priceValue.classList = 'fw-bold'
  $priceValue.textContent = ` ${
    item.price
      ? formatter.format(
          item.price < 0 ? item.price.toFixed(0) * -1 : item.price.toFixed(0)
        )
      : '$ 0'
  }`
  $price.appendChild($priceValue)

  const $stock = document.createElement('p')
  $stock.textContent = 'Unidades en stock: '
  if (user) $info.appendChild($stock)

  const $stockQuantity = document.createElement('span')
  $stockQuantity.textContent = item.stock
  $stock.appendChild($stockQuantity)

  const $quantity = document.createElement('div')
  $quantity.classList = 'quantity'
  if (user) $info.appendChild($quantity)

  const $quantityHandler = document.createElement('button')
  if (item.stock <= 0) {
    $quantityHandler.disabled = true
  }
  $quantityHandler.classList = 'quantity__handler'
  $quantityHandler.type = 'button'
  $quantityHandler.textContent = '-'
  $quantityHandler.addEventListener('click', () => {
    $quantityHandler.nextElementSibling.stepDown()
  })
  $quantity.appendChild($quantityHandler)

  const $quantityInput = document.createElement('input')
  $quantityInput.type = 'number'
  $quantityInput.id = `quantity-${item.id}`
  $quantityInput.min = 0
  $quantityInput.value = 0
  $quantity.appendChild($quantityInput)

  const $quantityHandler2 = document.createElement('button')
  $quantityHandler2.classList = 'quantity__handler'
  $quantityHandler2.type = 'button'
  $quantityHandler2.textContent = '+'
  $quantityHandler2.addEventListener('click', () => {
    $quantityHandler2.previousElementSibling.stepUp()
  })

  $quantity.appendChild($quantityHandler2)

  const $addToCart = document.createElement('button')
  $addToCart.classList =
    'button-sm bg-secondary-300 bg-hover-secondary-400 mt-2'
  $addToCart.textContent = 'Añadir al carro'
  $addToCart.addEventListener('click', () => {
    const newItem = new ArticleOrder(
      0,
      item.id,
      item.name,
      item.price,
      $quantityInput.value,
      0,
      '0',
      '0',
      0,
      item.price * $quantityInput.value,
      0,
      item.price,
      item.price * $quantityInput.value,
      0,
      false,
      item.images,
      item.stock
    )
    addToCart(newItem)
  })
  if (user) $info.appendChild($addToCart)

  const $icon = document.createElement('i')
  $icon.classList = 'fa-solid fa-cart-plus'
  $addToCart.appendChild($icon)

  return $card
}

export async function renderDolar() {
  const $dolar = document.querySelector('#dolar')
  const dolar = await getDolar()

  $dolar.textContent = `Valor dolar : $${dolar.value.trim()}`
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
