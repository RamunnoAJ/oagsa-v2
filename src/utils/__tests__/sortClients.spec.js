import { sortClients } from '../sortClients.js'

describe('sortClients', () => {
  test('should sort clients', () => {
    const clients = [{ razonSocial: 2 }, { razonSocial: 5 }, { razonSocial: 4 }, { razonSocial: 3 }, { razonSocial: 1 }]
    const sortedClients = [{ razonSocial: 1 }, { razonSocial: 2 }, { razonSocial: 3 }, { razonSocial: 4 }, { razonSocial: 5 }]

    sortClients(clients)
    expect(clients).toEqual(sortedClients)
  })
})
