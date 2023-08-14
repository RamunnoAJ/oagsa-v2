import { BASE_URL, getDataFromDB } from '../utils/getDataFromDB.js'

export async function getArticle(id) {
  const data = await getDataFromDB(
    `articulo/articulo-codigo?pCodigoArticulo=${id}`
  )
  const images = data.data

  return images
}

export async function setImage(id, image) {
  const response = await fetch(
    `${BASE_URL}articulo/imagen-alta?pCodigoArticulo=${id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: '*/*',
      },
      body: image,
    }
  )

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
}

export async function deleteImage(id, image) {
  const response = await fetch(
    `${BASE_URL}articulo/imagen-baja?pCodigoArticulo=${id}&pNombreImagen=${image}`,
    {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
}
