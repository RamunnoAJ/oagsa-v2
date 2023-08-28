import { sortProducts } from '../sortProducts.js'

describe('sortProducts', () => {
  test('should sort products', () => {
    const products = [{ id: 2 }, { id: 5 }, { id: 4 }, { id: 3 }, { id: 1 }]
    const sortedProducts = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ]

    sortProducts(products)

    expect(products).toEqual(sortedProducts)
  })

  test('should sort products without id', () => {
    const products = [
      { name: 2 },
      { name: 5 },
      { name: 4 },
      { name: 3 },
      { name: 1 },
    ]

    sortProducts(products)

    expect(products).toEqual([
      { name: 2 },
      { name: 5 },
      { name: 4 },
      { name: 3 },
      { name: 1 },
    ])
  })
})
