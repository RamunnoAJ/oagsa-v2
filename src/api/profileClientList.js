import getDataFromDB from '../utils/getDataFromDB.js'

export async function getClientsFromSeller(url) {
  if (url === 1) {
    const response = await getDataFromDB(`cliente/all`)
    const clients = await response.data
    return clients
  }
  const response = await getDataFromDB(`cliente/vendedor?pVendedor=${url}`)
  const clients = await response.data

  return clients
}
