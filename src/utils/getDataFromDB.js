export const BASE_URL = 'https://api.oagsa.com/api/'

/**
 * @param {string} url
 * @returns {object}
 * */
export async function getDataFromDB(url) {
  if (typeof url !== 'string') throw new Error('url must be a string')
  const response = await fetch(`${BASE_URL}${url}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  return data
}

export default getDataFromDB
