import { Dolar } from '../entities/dolar.js'

/** @typedef {import('../entities/dolar.js').Dolar} Dolar */

/**
 * @param {Dolar} dolarApi
 * @returns {Dolar}
 * */
export function dolarMapper(dataApi) {
  const { valorClave, descripcion, valorString, fechaModificacion } = dataApi

  return new Dolar(valorClave, descripcion, valorString, fechaModificacion)
}
