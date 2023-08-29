import { sortProducts } from '../sortProducts.js'

describe('sortProducts', () => {
  test('should sort products', () => {
    const products = [
      { codigoArticulo: 2 },
      { codigoArticulo: 5 },
      { codigoArticulo: 4 },
      { codigoArticulo: 3 },
      { codigoArticulo: 1 },
    ]
    const sortedProducts = [
      { codigoArticulo: 1 },
      { codigoArticulo: 2 },
      { codigoArticulo: 3 },
      { codigoArticulo: 4 },
      { codigoArticulo: 5 },
    ]

    sortProducts(products)

    expect(products).toEqual(sortedProducts)
  })

  test('should sort products without codigoArticulo', () => {
    const products = [
      { nombre: 2 },
      { nombre: 5 },
      { nombre: 4 },
      { nombre: 3 },
      { nombre: 1 },
    ]

    sortProducts(products)

    expect(products).toEqual([
      { nombre: 2 },
      { nombre: 5 },
      { nombre: 4 },
      { nombre: 3 },
      { nombre: 1 },
    ])
  })
})
