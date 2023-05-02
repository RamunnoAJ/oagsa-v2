import { sortClients } from '../utils/sortClients.js'

export const renderClients = (clients, parent) => {
  parent.innerHTML = ''
  sortClients(clients)

  clients.forEach(client => {
    const cardContent = `<article class="client-card">
    <h3 class="client-card__title">${client.razonSocial}</h3>
    <p class="client-card__address">${client.direccion}</p>
    <p class="client-card__zone">${client.localidad}</p>
    <p class="client-card__telephone">${client.telefono}</p>
    <p class="client-card__email">${client.email}</p>
    </article>`
    const card = document.createElement('div')
    card.innerHTML = cardContent
    parent.appendChild(card)
  })
}

export const filterClients = (array, param) => {
  return array.filter(item => item.razonSocial.toLowerCase().includes(param))
}
