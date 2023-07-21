import getDataFromDB, { BASE_URL } from "../utils/getDataFromDB.js"

export async function getMaintenance(){
  const response = await getDataFromDB('admin/set-mantenimiento')
  const maintenance = await response.data

  return maintenance
}

export async function setMaintenance(){
  const response = await fetch(`${BASE_URL}admin/set-mantenimiento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  console.log(response)
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
}
