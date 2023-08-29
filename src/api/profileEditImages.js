import { articlesMapper } from '../mappers/articles.js'
import { BASE_URL, getDataFromDB } from '../utils/getDataFromDB.js'

/**
 * @param {string} id
 * @returns {import('../mappers/articles.js').Article}
 * */
export async function getArticle(id) {
  const data = await getDataFromDB(
    `articulo/articulo-codigo?pCodigoArticulo=${id}`
  )
  const articleApi = data.data
  const article = articlesMapper(articleApi)

  return article
}

/**
 * @param {string} id
 * @param {File} file
 * */
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
    .catch(error => {
      console.error('Error:', error)
    })
}

/**
 * @param {string} id
 * */
export async function deleteImage(id) {
  const response = await fetch(
    `${BASE_URL}articulo/imagen-baja?pCodigoArticulo=${id}`,
    {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
      },
    }
  )

  if (!response.ok) throw new Error('Respuesta rechazada')
}
