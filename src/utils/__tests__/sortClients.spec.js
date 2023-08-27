import { sortClients } from '../sortClients.js'

describe('sortClients', () => {
  test('should sort clients', () => {
    const clients = [
      { name: 2 },
      { name: 5 },
      { name: 4 },
      { name: 3 },
      { name: 1 },
    ]
    const sortedClients = [
      { name: 1 },
      { name: 2 },
      { name: 3 },
      { name: 4 },
      { name: 5 },
    ]

    sortClients(clients)
    expect(clients).toEqual(sortedClients)
  })

  test('should sort clients without name', () => {
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
