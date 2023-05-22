export const BASE_URL = 'http://api.oagsa.com/api/'

export async function getDataFromDB(url) {
  const response = await fetch(`${BASE_URL}${url}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  return data
}

export default getDataFromDB
