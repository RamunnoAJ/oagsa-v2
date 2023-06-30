import getDataFromDB from "../utils/getDataFromDB.js"

export async function getDrafts(id) {
  const response = await getDataFromDB(`orden-compra/vendedor?pCodigoVendedor=${id}`)

  const drafts = await response.data
  const filteredDrafts = drafts.filter(draft => {
    return draft.borrador === 1 
  })

  return drafts
}

export async function getDraft(id){
  const response = await getDataFromDB(`orden-compra?pNumeroNota=${id}`) 
  const draft = await response.data
  return draft
}
