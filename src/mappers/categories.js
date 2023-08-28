import { Category, Subcategory, Class } from '../entities/categories.js'

/**
 * @typedef {import('../entities/categories.js').Category} Category
 * @typedef {import('../entities/categories.js').Subcategory} Subcategory
 * @typedef {import('../entities/categories.js').Class} Class
 * */

/**
 * @param {object} apiData
 * @returns {Category}
 * */
export function categoriesMapper(apiData) {
  const { codigoRubro, descripcion } = apiData

  return new Category(codigoRubro, descripcion)
}

/**
 * @param {object} apiData
 * @returns {Subcategory}
 * */
export function subcategoriesMapper(apiData) {
  const { codigoSubRubro, codigoRubro, descripcion } = apiData

  return new Subcategory(codigoSubRubro, codigoRubro, descripcion)
}

/**
 * @param {object} apiData
 * @returns {Class}
 * */
export function classMaper(apiData) {
  const { idSuperRubro, nombre } = apiData

  return new Class(idSuperRubro, nombre)
}
