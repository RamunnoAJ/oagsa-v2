export function sortProducts(products) {
  products.sort((a, b) => {
    if (a?.codigoArticulo < b?.codigoArticulo) {
      return -1
    } else if (a?.codigoArticulo > b?.codigoArticulo) {
      return 1
    }
    return 0
  })
}
