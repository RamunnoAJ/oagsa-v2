import { clearCart, getCart, saveCart } from "../cart";

describe('getCart function', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    localStorage.setItem.mockClear()
  })

  test('should return an empty array if there is no cart', () => {
    expect(getCart()).toEqual({ listaDetalle: [] })
  })

  test('should return the cart', () => {
    localStorage.setItem('cart', '{"listaDetalle": [{ "codigoArticulo": "1", "precio": 100, "cantidadPedida": 1 }]}')

    expect(getCart()).toEqual({ listaDetalle: [{ codigoArticulo: '1', precio: 100, cantidadPedida: 1 }] })
  })
})

describe('clearCart function', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    localStorage.setItem.mockClear()
  })

  test('should clear the cart', () => {
    localStorage.setItem('cart', '{"listaDetalle": [{ "codigoArticulo": "1", "precio": 100, "cantidadPedida": 1 }]}')

    clearCart()
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', '{"listaDetalle": []}')
  })
})

describe('saveCart function', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    localStorage.setItem.mockClear()
  })

  test('should save the cart', () => {
    saveCart({name:'john'})
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', "{\"name\":\"john\"}")
  })
})
