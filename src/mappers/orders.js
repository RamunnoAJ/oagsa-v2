import { Order } from '../entities/orders.js'

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
    listaDetalle
  )
}
