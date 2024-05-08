import { orderMapper } from '../mappers/orders.js'
import getDataFromDB, { BASE_URL } from '../utils/getDataFromDB.js'

/** @typedef {import('../entities/orders.js').Order} Order */

/**
 * @param {string} id
 * @return {Order[]}
 * */
export async function getDrafts(id) {
  const response = await getDataFromDB(
    `orden-compra/vendedor?pCodigoVendedor=${id}&pBorrador=1`,
  )
  const draftsApi = await response.data
  console.log(draftsApi)
  const drafts = draftsApi.map(draft => orderMapper(draft))

  return drafts
}

/**
 * @param {string} id
 * @return {Order}
 * */
export async function getDraft(id) {
  try {
    const response = await getDataFromDB(`orden-compra?pNumeroNota=${id}`)
    const draftApi = await response.data
    const draft = orderMapper(draftApi)
    return draft
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * @param {string} id
 * @return {object}
 * */
export async function removeDraft(id) {
  const response = await fetch(
    `${BASE_URL}orden-compra/delete-borrador?pNumeroOrden=${id}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  return response
}
