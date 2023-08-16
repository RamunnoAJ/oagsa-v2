import { BASE_URL, getDataFromDB } from '../utils/getDataFromDB.js'

export async function getArticle(id) {
  const data = await getDataFromDB(
    `articulo/articulo-codigo?pCodigoArticulo=${id}`
  )
  const images = data.data

  return images
}

export async function setImage(id, file) {
  const url = `${BASE_URL}articulo/imagen-alta?pCodigoArticulo=${id}`

  const formData = new FormData()
  formData.append('file', file, file.name)

  fetch(url, {
    method: 'POST',
    headers: {
      accept: '*/*',
    },
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

export async function deleteImage(id) {
  console.log(id)
  const response = await fetch(
    `${BASE_URL}articulo/imagen-baja?pCodigoArticulo=${id}`,
    {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
      },
    }
  )

  console.log(response)

  if (!response.ok) throw new Error('Respuesta rechazada')
}
