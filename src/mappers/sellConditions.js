import { SellCondition } from '../entities/sellConditions.js'

/** @typedef {import('../entities/sellConditions.js').SellCondition} SellCondition */

/**
 * @param {object} apiData
 * @return {SellCondition}
 * */
export function sellConditionMapper(apiData) {
  const { codigoCondicionVenta, descripcion, tipo } = apiData

  return new SellCondition(codigoCondicionVenta, descripcion, tipo)
}
