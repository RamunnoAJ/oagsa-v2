import { getProducts } from './api/profilePricesList.js'
import { renderProductPrices } from './ui/profilePricesList.js'

export async function profilePricesList($profileInfoContainer) {
  $profileInfoContainer.innerHTML = '<span class "loader"></span>'

  const products = await getProducts('precio/rubro?pCodigoRubro=A001')

  renderProductPrices(products, $profileInfoContainer)
}
