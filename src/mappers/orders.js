import { Order } from '../entities/orders.js'
import { orderArticlesMapper } from './articles.js'
import { getUserFromStorage } from '../storage/storageData.js'

/** @typedef {import('../entities/orders.js').Order} Order */

/**
 * @param {object} apiData
 * @return {Order}
 * */
export function orderMapper(apiData) {
  const {
    numeroNota,
    codigoCliente,
    nombreCliente,
    codigoCondicionVenta,
    observaciones,
    origenPedido,
    estado,
    totalPesos,
    totalItems,
    codigoVendedor,
    nombreVendedor,
    fechaNota,
    borrador,
    idFlete,
    descripcionFlete,
    listaDetalle,
  } = apiData

  const detail = listaDetalle.map(item => orderArticlesMapper(item))

  return new Order(
    numeroNota,
    codigoCliente,
    nombreCliente,
    codigoCondicionVenta,
    observaciones,
    origenPedido,
    estado,
    totalPesos,
    totalItems,
    codigoVendedor,
    nombreVendedor,
    fechaNota,
    borrador,
    idFlete,
    descripcionFlete,
    detail
  )
}

/**
 * @param {Order} order
 * @return {object}
 * */
export function postOrderMapper(order) {
  const {
    id,
    idClient,
    clientName,
    idSellCondition,
    observations,
    orderOrigin,
    status,
    total,
    items,
    idSeller,
    nameSeller,
    date,
    draft,
    idFreight,
    freight,
    detail,
  } = order

  const listaDetalle = detail.map(item => {
    return {
      numeroNota: id,
      codigoArticulo: item.id,
      descripcionArticulo: item.name,
      precio: item.price || 0,
      cantidadPedida: item.quantity,
      cantidadDespachada: item.quantityDelivered,
      codigoDescuento: item.idDiscount,
      descripcionDescuento: item.discount,
      porcentajeDescuento: item.discountPercentage,
      importe: item.total,
      importeDescuento: item.totalDiscount,
      precioConDescuento: item.priceDiscount || 0,
      montoTotal: item.priceTotal,
      numeroOrden: 0,
      eliminado: item.deleted,
      imagenesUrl: [],
    }
  })

  return {
    numeroNota: id || 0,
    codigoCliente: Number(idClient),
    nombreCliente: clientName,
    codigoCondicionVenta: idSellCondition,
    observaciones: observations || '',
    origenPedido: orderOrigin || 0,
    estado: status || 'A Procesar',
    totalPesos: total,
    totalItems: items,
    codigoVendedor: idSeller || JSON.parse(getUserFromStorage()).id,
    nombreVendedor: nameSeller || JSON.parse(getUserFromStorage()).name,
    fechaNota: date || new Date().toISOString(),
    borrador: draft,
    idFlete: Number(idFreight),
    descripcionFlete: freight,
    listaDetalle,
  }
}
