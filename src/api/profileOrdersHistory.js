import getDataFromDB from '../utils/getDataFromDB.js'

export async function getOrders(id, idCliente = 0, offset = 1) {
  if (id === 1) id = 0
  const response = await getDataFromDB(
    `orden-compra/vendedor?pCodigoVendedor=${id}&pCodigoCliente=${idCliente}&pBorrador=0&pPageSize=15&pPageNumber=${offset}`
  )
  const orders = await response.data

  return orders
}
