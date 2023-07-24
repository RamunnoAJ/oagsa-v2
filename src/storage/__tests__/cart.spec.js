import { getCart } from "../cart";

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
