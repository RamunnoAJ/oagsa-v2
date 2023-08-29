import { Movement } from '../entities/accountMovements.js'

/**
 * @param {object} dataApi
 * @returns {Movement}
 * */
export function movementsMapper(dataApi) {
  const {
    idMovimiento,
    codigoCliente,
    codigoVendedor,
    codigoZona,
    fechaEmision,
    fechaVencimiento,
    cuota,
    tipoComprobante,
    letra,
    puntoVenta,
    numero,
    importe,
    importePendiente,
  } = dataApi

  return new Movement(
    idMovimiento,
    codigoCliente,
    codigoVendedor,
    codigoZona,
    fechaEmision,
    fechaVencimiento,
    cuota,
    tipoComprobante,
    letra,
    puntoVenta,
    numero,
    importe,
    importePendiente
  )
}
