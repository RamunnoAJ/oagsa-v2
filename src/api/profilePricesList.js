import getDataFromDB from '../utils/getDataFromDB.js'

export async function getProducts(url) {
  const response = await getDataFromDB(url)
  const products = await response.data

  return products
}

export async function getCategories(url) {
  const response = await getDataFromDB(url)
  const categories = await response.data

  return categories
}
