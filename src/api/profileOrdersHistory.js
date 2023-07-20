import getDataFromDB from "../utils/getDataFromDB.js";

export async function getOrders(id) {
  const response = await getDataFromDB(`orden-compra/vendedor?pCodigoVendedor=${id}&pBorrador=0&pPageSize=1000`)
  const orders = await response.data
  console.log(orders)

  return orders
}
