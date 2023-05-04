import getDataFromDB from '../utils/getDataFromDB.js'

export async function getAccountMovements(url) {
  const response = await getDataFromDB(
    `cliente/cuenta-corriente?pCodigoCliente=${url}`
  )
  const accountMovements = await response.data

  return accountMovements
}
