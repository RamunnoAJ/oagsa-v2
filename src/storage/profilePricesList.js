function getSubrubrosKey(id) {
  return `subrubro_${id}`
}

export function getRubros(rubros) {
  if (rubros === undefined) throw new Error(`Rubros: ${rubros} not founded`)

  return JSON.parse(localStorage.getItem(rubros))
}

export function getSubrubros(subrubros) {
  if (subrubros === undefined)
    throw new Error(`Subrubros: ${subrubros} not founded`)

  return JSON.parse(localStorage.getItem(getSubrubrosKey(subrubros)))
}

export function saveRubros(rubros) {
  if (rubros === undefined || typeof rubros !== 'object') {
    throw new Error('You should pass a valid object to save on local storage')
  }

  localStorage.setItem('rubros', JSON.stringify(rubros))
}

export function saveSubrubros(subrubros, id) {
  if (subrubros === undefined || typeof subrubros !== 'object') {
    throw new Error('You should pass a valid object to save on local storage')
  }

  localStorage.setItem(getSubrubrosKey(id), JSON.stringify(subrubros))
}

export function getProducts() {
  return JSON.parse(localStorage.getItem('products'))
}
export function saveProducts(products) {
  if (products === undefined || typeof products !== 'string') {
    throw new Error('You should pass a valid object to save on local storage')
  }

  localStorage.setItem('products', JSON.stringify(products))
}
