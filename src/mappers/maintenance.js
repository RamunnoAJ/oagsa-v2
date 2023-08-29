import { Maintenance } from '../entities/maintenance.js'

export function maintenanceMapper(dataApi) {
  const { valorClave, descripcion, valorString, fechaModificacion } = dataApi

  return new Maintenance(
    valorClave,
    descripcion,
    valorString,
    fechaModificacion
  )
}
