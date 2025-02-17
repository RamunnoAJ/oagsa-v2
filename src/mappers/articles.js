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
    imagenes,
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
    precio || 0,
    seMuestraEnWeb,
    stock,
    stockUnidades,
    url,
    imagenes
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
    stock,
  } = apiData

  return new ArticleOrder(
    numeroNota,
    codigoArticulo,
    descripcionArticulo,
    precio || 0,
    cantidadPedida,
    cantidadDespachada,
    codigoDescuento,
    descripcionDescuento,
    porcentajeDescuento,
    importe,
    importeDescuento,
    precioConDescuento || 0,
    montoTotal,
    numeroOrder,
    eliminado,
    imagenesUrl,
    stock
  )
}
