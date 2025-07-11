import { getCategories } from '../api/profilePricesList.js'
import { searchProducts, getProducts } from '../api/store.js'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter.js'
import * as storage from '../storage/store.js'
import { addToCart } from '../cart.js'
import { sortProducts } from '../utils/sortProducts.js'
import { getDolar } from '../api/dolar.js'
import { getUserFromStorage } from '../storage/storageData.js'
import { ArticleOrder } from '../entities/articles.js'
import { showToast } from '../utils/showToast.js'
import { formatter } from '../utils/formatPrice.js'
import { SURPASS_STOCK } from '../consts.js'

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
  const selectedStock = await $form.stock.value

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
    if (user?.role === 3) {
      productsString += `&pConStock=false`
    } else {
      productsString += `&pConStock=${selectedStock || 'false'}`
    }

    const products = await getProducts(productsString)
    storage.saveToLocalStorage('products_store', products)

    renderProducts(products)
  }
}

async function handleSubmitSearch(e) {
  e.preventDefault()

  const value = document.querySelector('#searchByCode').value
  const products = await searchProducts(value)
  renderProducts(products)
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
    case '#stock':
      $select.innerHTML = `<option disabled selected value=''>Con stock</option>
      <option value="true">Si</option>
      <option value="false">No</option>`
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
  const $conStockInput = document.querySelector('#stock')
  const user = JSON.parse(getUserFromStorage())

  if (user?.role && user.role !== 3) {
    $conStockInput.classList.remove('visually-hidden')
    renderOptions(undefined, '#stock')
  }

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

  if (products?.length > 0) {
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
  const images = item.url.map(i =>
    i ? 'oagsa' + i.split('oagsa')[1].replace('\\public_html', '') : null
  )

  let image = images[0]

  if (!image) {
    image = getImage(item.idCategory.trim())
  }

  const $image = document.createElement('img')
  $image.src = 'https://' + image
  $image.alt = item.name
  $image.classList = 'store__product__card__image'
  $image.addEventListener('click', () => {
    if (images.length > 0) openImageModal(images)
    else openImageModal([image])
  })
  $image.style.cursor = 'pointer'
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
  if (!SURPASS_STOCK) {
    $quantityInput.max = item.stock
  }
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
    if (!SURPASS_STOCK) {
      if (item.stock < $quantityInput.value) {
        showToast('No puedes agregar un objeto de stock mayor al disponible')
        return
      }
    }

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
      item.url,
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

function openImageModal(images) {
  let currentIndex = 0

  const $modal = document.createElement('div')
  $modal.classList = 'image-modal'
  $modal.innerHTML = `
    <div class="image-modal__content">
      <span class="image-modal__close">&times;</span>
      ${
        images.length > 1
          ? "<button class='image-modal__prev'>&lt;</button>"
          : ''
      }
      <img src="${
        'https://' + images[currentIndex]
      }" class="image-modal__img" />
      ${
        images.length > 1
          ? "<button class='image-modal__next'>&gt;</button>"
          : ''
      }
      <div class="image-modal__thumbnails"></div>
    </div>
  `

  document.body.appendChild($modal)

  const $image = $modal.querySelector('.image-modal__img')
  const $prevBtn = $modal.querySelector('.image-modal__prev')
  const $nextBtn = $modal.querySelector('.image-modal__next')
  const $thumbnailsContainer = $modal.querySelector('.image-modal__thumbnails')

  images.forEach((imgSrc, index) => {
    const $thumb = document.createElement('img')
    $thumb.src = 'https://' + imgSrc
    $thumb.classList = 'image-modal__thumbnail'
    if (index === currentIndex) $thumb.classList.add('active')

    $thumb.addEventListener('click', () => updateImage(index))
    $thumbnailsContainer.appendChild($thumb)
  })

  function updateImage(index) {
    currentIndex = (index + images.length) % images.length
    $image.src = 'https://' + images[currentIndex]

    document
      .querySelectorAll('.image-modal__thumbnail')
      .forEach(($thumb, i) => {
        $thumb.classList.toggle('active', i === currentIndex)
      })
  }

  if ($prevBtn && $nextBtn) {
    $prevBtn.addEventListener('click', () => updateImage(currentIndex - 1))
    $nextBtn.addEventListener('click', () => updateImage(currentIndex + 1))
  }

  $modal.addEventListener('click', e => {
    if (
      e.target.classList.contains('image-modal') ||
      e.target.classList.contains('image-modal__close')
    ) {
      document.body.removeChild($modal)
    }
  })
}

export async function renderDolar() {
  const $dolar = document.querySelector('#dolar')
  const dolar = await getDolar()

  $dolar.textContent = `Valor dolar : $${dolar.value.trim()}`
}

const IMAGES = {
  U001: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2011%20-%20HERRAMIENTA.png?alt=media&token=b06bbe3a-cd7e-4a80-a4e7-3bccb9a8df33&_gl=1*15t1cdf*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NTk4MzMyMC4yLjEuMTY4NTk4NDI0Ny4wLjAuMA',
  U002: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2021%20-%20CASCO%20MOTO.png?alt=media&token=35372e86-cd9c-4142-9987-8922bf8a5bc7&_gl=1*1xq7zgf*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU5OC4wLjAuMA..',
  O001: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%20%2017%20-%20LUBRICANTE.png?alt=media&token=96998bf8-ecfd-42e4-b05c-8a65967df918&_gl=1*71q4za*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU3MS4wLjAuMA..',
  R001: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..',
  R040: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..',
  R057: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..',
  R058: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..',
  Z001: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..',
  W100: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%20%2017%20-%20LUBRICANTE.png?alt=media&token=96998bf8-ecfd-42e4-b05c-8a65967df918&_gl=1*71q4za*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU3MS4wLjAuMA..',
  C039: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2019%20-%20CASCOS%20BICI.png?alt=media&token=b056c059-b7b7-434a-87fa-14380ec41cf7&_gl=1*1piegc8*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU5My4wLjAuMA..',
  F240: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2013%20-%20ARTICULOS%20DE%20BICI.png?alt=media&token=89594a59-a8e5-4ad5-956f-6b5617fd59ec&_gl=1*1hygt*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4My4wLjAuMA..',
  F700: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..',
  F800: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%201%20-%20BICICLETA.png?alt=media&token=ee32880e-5be8-4ba8-9e88-89e510546bce&_gl=1*19kjrha*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU3Ni4wLjAuMA..',
  V001: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..',
  P090: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..',
  P100: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..',
  P400: 'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2023%20-%20CADENA%20MOTO.png?alt=media&token=9e1f0d47-58b0-46a9-bbff-698736e9dba2&_gl=1*btavat*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzYwMy4wLjAuMA..',
  DEFAULT:
    'firebasestorage.googleapis.com/v0/b/oagsa-1d9e9.appspot.com/o/Web%20Oagsa%20Iconos%2FOAGSA%20-%20Iconos%20Web%2015%20-%20CUBIERTA%20DE%20BICI.png?alt=media&token=b11b4ad8-3be2-4636-bca7-fff24f31e36c&_gl=1*as18e2*_ga*MTg4MzM4NDcyNC4xNjg1NzQwOTY2*_ga_CW55HF8NVT*MTY4NjA2NzU2Mi40LjEuMTY4NjA2NzU4OC4wLjAuMA..',
}

function getImage(image) {
  return IMAGES[image] || IMAGES['DEFAULT']
}
