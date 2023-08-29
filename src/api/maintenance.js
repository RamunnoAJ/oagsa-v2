import { maintenanceMapper } from '../mappers/maintenance.js'
import getDataFromDB, { BASE_URL } from '../utils/getDataFromDB.js'

/**
 * @returns {import('../mappers/maintenance.js').Maintenance}
 * */
export async function getMaintenance() {
  const response = await getDataFromDB('admin/mantenimiento')
  const maintenanceApi = await response.data
  const maintenance = maintenanceMapper(maintenanceApi)

  return maintenance
}

export async function setMaintenance() {
  const response = await fetch(`${BASE_URL}admin/set-mantenimiento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
}
