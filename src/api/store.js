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

  console.log(productsApi)
  const products = productsApi.map(product => articlesMapper(product))
  console.log(products)

  return products
}
