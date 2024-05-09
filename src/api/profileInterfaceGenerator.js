import { BASE_URL, getDataFromDB } from '../utils/getDataFromDB.js'
import { noteMapper } from '../mappers/notes.js'

export async function getPrepararNotas() {
  const response = await getDataFromDB('orden-compra/prepara-notas')
  const file = await response.data

  return file
}

export async function getNotas() {
  const response = await getDataFromDB('orden-compra/lista-notas')
  const notasApi = await response.data
  const notas = notasApi.map(note => noteMapper(note))

  return notas
}

export async function downloadFile() {
  fetch(`${BASE_URL}orden-compra/download`)
    .then(res => res.blob())
    .then(data => {
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `pedidos-${new Date().toISOString().split('T')[0]}.zip`
      a.click()
    })
}
