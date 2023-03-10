const getDataFromDB = async url => {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  return data
}

export default getDataFromDB
