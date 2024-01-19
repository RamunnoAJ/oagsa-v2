import getDataFromDB, { BASE_URL } from '../utils/getDataFromDB.js'

/**
 * @param {string} url
 * @param {object} postBody
 * @returns {object}
 * */
export async function postCustomerPreload(url, postBody) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(postBody),
  })

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  const data = await response.json()
  return data
}

/** @param {string} idSeller
 * @param {string} state
 * @returns {object[]}
 */
export async function getCustomerPreload(idSeller, state) {
  const response = await getDataFromDB(
    `clienteprecarga?pCodigoVendedor=${idSeller}&pEstado=${state}`
  )
  const data = await response.data
  return data
}

/**
 * @param {object} client
 * @returns {object}
 * */
export async function toggleCustomPreloadState(client) {
  const response = await fetch(`${BASE_URL}clienteprecarga/leido`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(client),
  })

  const data = await response.data
  return data
}
