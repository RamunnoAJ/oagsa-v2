import { BASE_URL } from "../utils/getDataFromDB.js" 

export async function postBuyOrder(url, postBody) {

  postBody.listaDetalle.forEach(item => {
    if (item.stockUnidades) delete item.stockUnidades
  })

  console.log(postBody)
  console.log(`POST ${BASE_URL}${url}`)
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(postBody),
  })
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }

  const data = await response.json()
  console.log(data)
}


export async function getClients(url) {
  let response = ''
  if (url === 1) {
    response = await fetch(`${BASE_URL}cliente/all`)
  } else {
    response = await fetch(`${BASE_URL}cliente/${url}`)
  }
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
  const data = await response.json()
  return data.data
}

export async function getFields(url){
  const response = await fetch(`${BASE_URL}${url}`)
  if (!response.ok) {
    throw new Error('Respuesta rechazada')
  }
  const data = await response.json()
  return data.data
}
