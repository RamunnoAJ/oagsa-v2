import { clearCart, getCart, saveCart } from '../cart'

describe('getCart function', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    localStorage.setItem.mockClear()
  })

  test('should return an empty array if there is no cart', () => {
    expect(getCart()).toEqual({ detail: [] })
  })

  test('should return the cart', () => {
    localStorage.setItem(
      'cart',
      '{"detail": [{ "id": "1", "price": 100, "quantity": 1 }]}'
    )

    expect(getCart()).toEqual({
      detail: [{ id: '1', price: 100, quantity: 1 }],
    })
  })
})

describe('clearCart function', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    localStorage.setItem.mockClear()
  })

  test('should clear the cart', () => {
    localStorage.setItem(
      'cart',
      '{"detail": [{ "id": "1", "price": 100, "quantity": 1 }]}'
    )

    clearCart()
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', '{"detail": []}')
  })
})

describe('saveCart function', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    localStorage.setItem.mockClear()
  })

  test('should save the cart', () => {
    saveCart({ name: 'john' })
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', '{"name":"john"}')
  })
})
