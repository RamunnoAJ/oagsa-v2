import getDataFromDB from "../utils/getDataFromDB.js"

export async function getDrafts(id) {
  const response = await getDataFromDB(`orden-compra/vendedor?pCodigoVendedor=${id}`)

  const drafts = await response.data
  const filteredDrafts = drafts.filter(draft => {
    return draft.borrador === 1 
  })

  return filteredDrafts
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
