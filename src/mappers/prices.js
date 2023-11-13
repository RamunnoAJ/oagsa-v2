import { ArticlePrice } from '../entities/prices.js'
/** @typedef {import('../entities/prices.js').ArticlePrice} ArticlePrice */

/**
 * @param {object} apiData
 * @returns {ArticlePrice}
 */
export function articlePricesMapper(apiData) {
  const {
    codigoArticulo,
    descripcion,
    marca,
    diametro,
    medidas,
    importe,
    porcentajeDescuento,
    precioConDescuento,
  } = apiData

  return new ArticlePrice(
    codigoArticulo,
    descripcion,
    marca,
    diametro,
    medidas,
    importe,
    precioConDescuento,
    porcentajeDescuento
  )
}
