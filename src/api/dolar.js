import getDataFromDB, { BASE_URL } from "../utils/getDataFromDB.js"

export async function getDolar(){
  const response = await getDataFromDB(`admin/dolar`)
  const dolar = await response.data

  return dolar
}

export async function postDolar(value){
  const response = await fetch(`${BASE_URL}admin/dolar?pValorDolar=${value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(value),
  })
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  } 
}
