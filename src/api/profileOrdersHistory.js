import getDataFromDB from "../utils/getDataFromDB.js";

export async function getOrders(id, idCliente = 0) {
  const response = await getDataFromDB(`orden-compra/vendedor?pCodigoVendedor=${id}&pCodigoCliente=${idCliente}&pBorrador=0&pPageSize=1000`)
  const orders = await response.data

  return orders
}
