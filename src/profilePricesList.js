import { getProducts } from './api/profilePricesList.js'

export const profilePricesList = async $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class "loader"></span>'

  const products = await getProducts('precio/rubro?pCodigoRubro=A001')

  console.log(products)
}
