import { articlesMapper } from '../mappers/articles.js'
import getDataFromDB from '../utils/getDataFromDB.js'
import { convertToUTF } from '../utils/convertToUTF.js'

/**
 * @param {string} url
 * @returns {import('../mappers/articles.js').Article}
 */
export async function getProducts(url) {
  const response = await getDataFromDB(url)
  const productsApi = await response.data
  await productsApi.forEach(product => {
    product.descripcion = product.descripcion
    product.marca = convertToUTF(product.marca)
  })

  const products = productsApi.map(product => articlesMapper(product))

  return products
}

/**
 * @param {string} id
 * @returns {import('../mappers/articles.js').Article}
 */
export async function getProduct(id) {
  const response = await getDataFromDB(
    `articulo/articulo-codigo?pCodigoArticulo=${id}`
  )
  const product = await response.data
  product.marca = convertToUTF(product.marca)

  const finalProduct = articlesMapper(product)

  return finalProduct
}
