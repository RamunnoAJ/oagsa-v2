import getDataFromDB from '../utils/getDataFromDB.js'

export async function getClientsFromSeller(url) {
  const response = await getDataFromDB(`cliente/${url}`)
  const clients = await response.data

  return clients
}
