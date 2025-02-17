import {
  categoriesMapper,
  classMaper,
  subcategoriesMapper,
} from '../mappers/categories.js'
import { articlePricesMapper } from '../mappers/prices.js'
import { convertToUTF } from '../utils/convertToUTF.js'
import getDataFromDB, { BASE_URL } from '../utils/getDataFromDB.js'

/**
 * @param {string} url
 * @returns {import('../mappers/articles.js').Article}
 * */
export async function getProducts(url) {
  const response = await getDataFromDB(url)
  const productsApi = await response.data
  await productsApi.forEach(product => {
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
      subcategoriesMapper(subcategory)
    )
  } else {
    categories = categoriesApi.map(category => categoriesMapper(category))
  }

  return categories
}

export async function getBrands(url) {
  const response = await getDataFromDB(url)
  const categoriesApi = await response.data

  return categoriesApi
}

/**
 * @param {string} url
 * @param {string} url
 * */
export function downloadExcel(url, titulo) {
  fetch(`${BASE_URL}${url}`)
    .then(res => res.blob())
    .then(data => {
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `precios-${titulo}-${
        new Date().toISOString().split('T')[0]
      }.xlsx`
      a.click()
    })
}
