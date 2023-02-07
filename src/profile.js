const getDataFromDB = async url => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

getDataFromDB('http://api.oagsa.com/api/cliente/vendedor?pVendedor=1')
