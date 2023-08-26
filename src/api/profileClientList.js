import { clientsMapper } from '../mappers/clients.js'
import { convertToUTF } from '../utils/convertToUTF.js'
import getDataFromDB from '../utils/getDataFromDB.js'

export async function getClientsFromSeller(url) {
  if (url === 1) {
    const response = await getDataFromDB(`cliente/all`)
    const clientsApi = await response.data
    await clientsApi.forEach(client => {
      client.razonSocial = convertToUTF(client.razonSocial)
    })

    const clients = clientsApi.map(client => clientsMapper(client))

    return clients
  }

  const response = await getDataFromDB(`cliente/vendedor?pVendedor=${url}`)
  const clientsApi = await response.data
  await clientsApi.forEach(client => {
    client.razonSocial = convertToUTF(client.razonSocial)
  })

  const clients = clientsApi.map(client => clientsMapper(client))

  return clients
}
