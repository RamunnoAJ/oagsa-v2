import getDataFromDB from "../utils/getDataFromDB.js"
import { BASE_URL } from "../utils/getDataFromDB.js"

export async function getDrafts(id) {
  const response = await getDataFromDB(`orden-compra/vendedor?pCodigoVendedor=${id}&pBorrador=1`)
  const drafts = await response.data

  return drafts
}

export async function getDraft(id){
  const response = await getDataFromDB(`orden-compra?pNumeroNota=${id}`) 
  const draft = await response.data
  return draft
}

export async function removeDraft(id) {
  const response = await fetch(`${BASE_URL}orden-compra/delete-borrador?pNumeroOrden=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  return response
}
