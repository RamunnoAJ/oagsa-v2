import { clientsMapper } from '../mappers/clients.js'
import { convertToUTF } from '../utils/convertToUTF.js'
import getDataFromDB from '../utils/getDataFromDB.js'

/** @typedef {import('../entities/clients.js').Client} Client */

/**
 * @param {Client} seller
 * @return {Client[]}
 * */
export async function getClientsFromSeller(seller) {
  if (seller === 1) {
    const response = await getDataFromDB(`cliente/all`)
    const clientsApi = await response.data
    await clientsApi.forEach(client => {
      client.razonSocial = convertToUTF(client.razonSocial)
    })

    const clients = clientsApi.map(client => clientsMapper(client))

    return clients
  }

  const response = await getDataFromDB(`cliente/vendedor?pVendedor=${seller}`)
  const clientsApi = await response.data
  await clientsApi.forEach(client => {
    client.razonSocial = convertToUTF(client.razonSocial)
  })

  const clients = clientsApi.map(client => clientsMapper(client))

  return clients
}
