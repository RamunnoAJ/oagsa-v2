import { BASE_URL } from '../utils/getDataFromDB.js'

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
