import { sortClients } from '../sortClients.js'

describe('sortClients', () => {
  test('should sort clients', () => {
    const clients = [
      { razonSocial: 2 },
      { razonSocial: 5 },
      { razonSocial: 4 },
      { razonSocial: 3 },
      { razonSocial: 1 },
    ]
    const sortedClients = [
      { razonSocial: 1 },
      { razonSocial: 2 },
      { razonSocial: 3 },
      { razonSocial: 4 },
      { razonSocial: 5 },
    ]

    sortClients(clients)
    expect(clients).toEqual(sortedClients)
  })

  test('should sort clients without razonSocial', () => {
    const clients = [
      { nombre: 2 },
      { nombre: 5 },
      { nombre: 4 },
      { nombre: 3 },
      { nombre: 1 },
    ]

    sortClients(clients)
    expect(clients).toEqual([
      { nombre: 2 },
      { nombre: 5 },
      { nombre: 4 },
      { nombre: 3 },
      { nombre: 1 },
    ])
  })
})
