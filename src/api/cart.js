import { BASE_URL } from '../utils/getDataFromDB.js'
import { sellConditionMapper } from '../mappers/sellConditions.js'
import { freightMapper } from '../mappers/freights.js'
import { postOrderMapper } from '../mappers/orders.js'

/**
 * @param {string} url
 * @param {object} postBody
 * */
export async function postBuyOrder(url, postBody) {
  const order = postOrderMapper(postBody)
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(order),
  })
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
}

/**
 * @param {string} url
 * */
export async function getFields(url) {
  const response = await fetch(`${BASE_URL}${url}`)
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
  const dataApi = await response.json()
  let data = dataApi.data

  if ('codigoCondicionVenta' in data[0]) {
    data = data.map(data => sellConditionMapper(data))
  } else {
    data = data.map(data => freightMapper(data))
  }

  return data
}
