import { Freight } from '../entities/freights.js'

export function freightMapper(apiData) {
  const { id, descripcion, orden, leyenda } = apiData

  return new Freight(id, descripcion, orden, leyenda)
}
