import { Order } from '../entities/orders.js'
import { orderArticlesMapper } from './articles.js'

/** @typedef {import('../entities/orders.js').Order} Order */

/**
 * @param {object} apiData
 * @return {Order}
 * */
export function orderMapper(apiData) {
  const {
    numeroNota,
    codigoCliente,
    codigoCondicionVenta,
    observaciones,
    origenPedido,
    estado,
    totalPesos,
    totalItems,
    codigoVendedor,
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
    codigoCondicionVenta,
    observaciones,
    origenPedido,
    estado,
    totalPesos,
    totalItems,
    codigoVendedor,
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
    idSellCondition,
    observations,
    orderOrigin,
    status,
    total,
    items,
    idSeller,
    date,
    draft,
    idFreight,
    freight,
    detail,
  } = order

  const listaDetalle = detail.map(item => {
    return {
      numeroNota: item.idOrder,
      codigoArticulo: item.id,
      descripcionArticulo: item.name,
      precio: item.price,
      cantidadPedida: item.quantity,
      cantidadDespachada: item.quantityDelivered,
      codigoDescuento: item.idDiscount,
      descripcionDescuento: item.discount,
      porcentajeDescuento: item.discountPercentage,
      importe: item.total,
      importeDescuento: item.totalDiscount,
      precioConDescuento: item.priceDiscount,
      montoTotal: item.priceTotal,
      numeroOrder: item.orderNumber,
      eliminado: item.deleted,
      imagenesUrl: [],
    }
  })

  return {
    numeroNota: id,
    codigoCliente: idClient,
    codigoCondicionVenta: idSellCondition,
    observaciones: observations,
    origenPedido: orderOrigin,
    estado: status,
    totalPesos: total,
    totalItems: items,
    codigoVendedor: idSeller,
    fechaNota: date,
    borrador: draft,
    idFlete: idFreight,
    descripcionFlete: freight,
    listaDetalle,
  }
}
