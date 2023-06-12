import { calculateDiscount } from '../cart.js'

describe('calculateDiscount function', () => {
  test('should return the total with a 10% discount', () => {
    const total = 100
    const discount = 10
    const expected = 90

    const result = calculateDiscount(total, discount)

    expect(result).toBe(expected)
  })

  test('should return the total with a 50% discount', () => {
    const total = 200
    const discount = 50
    const expected = 100

    const result = calculateDiscount(total, discount)

    expect(result).toBe(expected)
  })

  test('should return the total with a 0% discount', () => {
    const total = 150
    const discount = 0
    const expected = 150

    const result = calculateDiscount(total, discount)

    expect(result).toBe(expected)
  })
})
