import { getDataFromDB } from '../utils/getDataFromDB.js'

export async function getArticle(id) {
  const data = await getDataFromDB(
    `articulo/articulo-codigo?pCodigoArticulo=${id}`
  )
  const images = data.data

  return images
}
