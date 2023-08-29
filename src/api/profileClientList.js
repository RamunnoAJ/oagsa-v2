import { convertToUTF } from '../utils/convertToUTF.js'
import getDataFromDB from '../utils/getDataFromDB.js'

export async function getClientsFromSeller(url) {
  if (url === 1) {
    const response = await getDataFromDB(`cliente/all`)
    const clients = await response.data
    await clients.forEach(client => {
      client.razonSocial = convertToUTF(client.razonSocial)
    })

    return clients
  }
  const response = await getDataFromDB(`cliente/vendedor?pVendedor=${url}`)
  const clients = await response.data
  await clients.forEach(client => {
    client.razonSocial = client.razonSocial
      .normalize('NFC')
      .replace(/Ã‘/g, 'Ñ')
      .replace(/[^\w\sÑñ]/g, '')
  })

  return clients
}
