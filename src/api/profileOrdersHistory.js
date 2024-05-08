import getDataFromDB from '../utils/getDataFromDB.js'
import { sellConditionMapper } from '../mappers/sellConditions.js'
import { orderMapper } from '../mappers/orders.js'
import { formatDate } from '../utils/formatDate.js'
import { isValidDate } from '../utils/isValidDate.js'

/**
 * @param {number} id
 * @param {number} idClient
 * @param {number} offset
 * @returns {import('../mappers/orders.js').Order[]}
 * */
export async function getOrders(id = 0, idClient = 0, offset = 1) {
  if (id === 1) id = 0
  const response = await getDataFromDB(
    `orden-compra/vendedor?pCodigoVendedor=${id}&pCodigoCliente=${idClient}&pBorrador=0&pPageSize=15&pPageNumber=${offset}`,
  )
  const ordersApi = await response.data
  const orders = ordersApi.map(order => orderMapper(order))

  orders.next = offset + 1
  orders.previous = offset - 1 || null
  orders.totalPages = Math.ceil(response.total / 15)

  return orders
}

/**
 * @param {number} id
 * @param {number} idClient
 * @param {number} offset
 * @param {string} fromDate
 * @param {string} toDate
 * @returns {import('../mappers/orders.js').Order[]}
 * */
export async function getOrdersDates(
  id = 0,
  idClient = 0,
  offset = 1,
  fromDate,
  toDate = new Date().toISOString().split('T')[0],
) {
  if (!toDate) toDate = new Date().toISOString().split('T')[0]
  if (isValidDate(toDate)) toDate = formatDate(toDate)
  if (id === 1) id = 0
  const response = await getDataFromDB(
    `orden-compra/vendedor-fecha?pCodigoVendedor=${id}&pCodigoCliente=${idClient}&pBorrador=0&pPageSize=15&pPageNumber=${offset}&pFechaDesde=${fromDate}&pFechaHasta=${toDate}`,
  )
  const ordersApi = await response.data
  const orders = ordersApi.map(order => orderMapper(order))

  orders.next = offset + 1
  orders.previous = offset - 1 || null
  orders.totalPages = Math.ceil(response.total / 15)

  return orders
}

/**
 * @param {number} id
 * @return {string}
 */
export async function getCondicionVenta(id) {
  const response = await getDataFromDB(`orden-compra/condicionventa`)
  const condicionVentaApi = await response.data
  const condicionVenta = condicionVentaApi.map(item =>
    sellConditionMapper(item),
  )

  const description = condicionVenta.filter(object => object.id === id)[0]
    ?.description

  return description
}
