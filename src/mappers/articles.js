import { Article, ArticleOrder } from '../entities/articles.js'

/** @typedef {import('../entities/articles.js').Article} Article
 * @typedef {import('../entities/articles.js').ArticleOrder} ArticleOrder
 * */

/**
 * @param {object} apiData
 * @return {Article}
 * */
export function articlesMapper(apiData) {
  const {
    codigoArticulo,
    codigoRubro,
    codigoSubRubro,
    descripcion,
    diametro,
    marca,
    medidas,
    portada,
    precio,
    seMuestraEnWeb,
    stock,
    stockUnidades,
    url,
  } = apiData

  return new Article(
    codigoArticulo,
    codigoRubro,
    codigoSubRubro,
    descripcion,
    diametro,
    marca,
    medidas,
    portada,
    precio,
    seMuestraEnWeb,
    stock,
    stockUnidades,
    url
  )
}

/**
 * @param {object} apiData
 * @return {ArticleOrder}
 * */
export function orderArticlesMapper(apiData) {
  const {
    numeroNota,
    codigoArticulo,
    descripcionArticulo,
    precio,
    cantidadPedida,
    cantidadDespachada,
    codigoDescuento,
    descripcionDescuento,
    porcentajeDescuento,
    importe,
    importeDescuento,
    precioConDescuento,
    montoTotal,
    numeroOrder,
    eliminado,
    imagenesUrl,
  } = apiData

  return new ArticleOrder(
    numeroNota,
    codigoArticulo,
    descripcionArticulo,
    precio,
    cantidadPedida,
    cantidadDespachada,
    codigoDescuento,
    descripcionDescuento,
    porcentajeDescuento,
    importe,
    importeDescuento,
    precioConDescuento,
    montoTotal,
    numeroOrder,
    eliminado,
    imagenesUrl
  )
}
