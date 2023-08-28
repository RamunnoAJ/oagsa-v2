import getDataFromDB from '../utils/getDataFromDB.js'
import { sellConditionMapper } from '../mappers/sellConditions.js'

export async function getOrders(id = 0, idCliente = 0, offset = 1) {
  if (id === 1) id = 0
  const response = await getDataFromDB(
    `orden-compra/vendedor?pCodigoVendedor=${id}&pCodigoCliente=${idCliente}&pBorrador=0&pPageSize=15&pPageNumber=${offset}`
  )
  const orders = await response
  orders.next = offset + 1
  orders.previous = offset - 1 || null
  orders.totalPages = Math.ceil(orders.total / 15)

  return orders
}

export async function getCondicionVenta(id) {
  const response = await getDataFromDB(`orden-compra/condicionventa`)
  const condicionVentaApi = await response.data
  const condicionVenta = sellConditionMapper(condicionVentaApi)

  const description = condicionVenta.filter(object => object.id === id)[0]
    ?.description

  return description
}
