import { calculateDiscount, getTotalPrice, getTotalQuantity } from '../cart.js'

describe('calculateDiscount function', () => {
  test('should return the total with a 10% discount', () => {
    const total = 100
    const discount = 10
    const expected = 90

    const result = calculateDiscount(discount, total)

    expect(result).toBe(expected)
  })

  test('should return the total with a 50% discount', () => {
    const total = 200
    const discount = 50
    const expected = 100

    const result = calculateDiscount(discount, total)

    expect(result).toBe(expected)
  })

  test('should return the total with a 0% discount', () => {
    const total = 150
    const discount = 0
    const expected = 150

    const result = calculateDiscount(discount, total)

    expect(result).toBe(expected)
  })
})

describe('getTotalPrice function', () => {
  test('should return 200 given 2 items of 100 each', () => {
    const cart = {
      detail: [
        { id: '1', price: 100, quantity: 1 },
        { id: '2', price: 100, quantity: 1 },
      ],
    }
    const expected = '200'
    const result = getTotalPrice(cart)

    expect(result).toBe(expected)
  })
})

describe('getTotalQuantity function', () => {
  test('should return 2 given 2 items', () => {
    const cart = {
      detail: [
        { id: '1', price: 100, quantity: 1 },
        { id: '2', price: 100, quantity: 1 },
      ],
    }
    const expected = 2
    const result = getTotalQuantity(cart)

    expect(result).toBe(expected)
  })
})
