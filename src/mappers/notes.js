import { Note } from '../entities/notes.js'

/** @typedef {import('../entities/notes.js').Note} Note */

/**
 * @param {object} apiData
 * @return {Note}
 * */
export function noteMapper(apiData) {
  const {
    numeroNota,
    origenPedido,
    codigoCliente,
    codigoVendedor,
    idFlete,
    codigoCondicionVenta,
    borrador,
    fechaNota,
    estado,
    totalPesos,
    totalItems,
    observaciones,
  } = apiData

  return new Note(
    numeroNota,
    origenPedido,
    codigoCliente,
    codigoVendedor,
    idFlete,
    codigoCondicionVenta,
    borrador,
    fechaNota,
    estado,
    totalPesos,
    totalItems,
    observaciones
  )
}
