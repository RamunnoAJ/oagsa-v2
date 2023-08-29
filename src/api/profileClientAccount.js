import { movementsMapper } from '../mappers/accountMovements.js'
import getDataFromDB from '../utils/getDataFromDB.js'

/**
 * @param {string} url
 * @returns {import('../mappers/accountMovements.js').Movement}
 * */
export async function getAccountMovements(url) {
  const response = await getDataFromDB(
    `cliente/cuenta-corriente?pCodigoCliente=${url}`
  )
  const accountMovementsApi = await response.data
  const accountMovements = accountMovementsApi.map(accountMovement =>
    movementsMapper(accountMovement)
  )

  return accountMovements
}
