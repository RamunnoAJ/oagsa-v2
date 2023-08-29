import { convertToUTF } from '../utils/convertToUTF.js'
import getDataFromDB from '../utils/getDataFromDB.js'

export async function getProducts(url) {
  const response = await getDataFromDB(url)
  const products = await response.data
  await products.forEach(product => {
    product.descripcion = convertToUTF(product.descripcion)
    product.marca = convertToUTF(product.marca)
  })

  return products
}

export async function getCategories(url) {
  const response = await getDataFromDB(url)
  const categories = await response.data

  return categories
}
