import {
  categoriesMapper,
  classMaper,
  subcategoriesMapper,
} from '../mappers/categories.js'
import { articlePricesMapper } from '../mappers/prices.js'
import { convertToUTF } from '../utils/convertToUTF.js'
import getDataFromDB from '../utils/getDataFromDB.js'

/**
 * @param {string} url
 * @returns {import('../mappers/articles.js').Article}
 * */
export async function getProducts(url) {
  const response = await getDataFromDB(url)
  const productsApi = await response.data
  await productsApi.forEach(product => {
    product.descripcion = product.descripcion
    product.marca = convertToUTF(product.marca)
  })

  const products = productsApi.map(product => articlePricesMapper(product))

  return products
}

/**
 * @param {string} url
 * @return {object}
 * */
export async function getCategories(url) {
  const response = await getDataFromDB(url)
  const categoriesApi = await response.data
  let categories

  if (url.includes('all')) {
    categories = categoriesApi.map(category => classMaper(category))
  } else if (url.includes('subrubros')) {
    categories = categoriesApi.map(subcategory =>
      subcategoriesMapper(subcategory),
    )
  } else {
    categories = categoriesApi.map(category => categoriesMapper(category))
  }

  return categories
}
