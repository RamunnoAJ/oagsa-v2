import { dolarMapper } from '../mappers/dolar.js'
import getDataFromDB, { BASE_URL } from '../utils/getDataFromDB.js'

/**
 * @returns {import('../mappers/dolar.js').Dolar}
 * */
export async function getDolar() {
  const response = await getDataFromDB(`admin/dolar`)
  const dolarApi = await response.data
  const dolar = dolarMapper(dolarApi)

  return dolar
}

/**
 * @param {string} value
 * */
export async function postDolar(value) {
  const response = await fetch(`${BASE_URL}admin/dolar?pValorDolar=${value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(value),
  })
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
}
