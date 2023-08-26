import { sortClients } from '../utils/sortClients.js'

const renderClients = (clients, parentElement) => {
  parentElement.innerHTML = ''
  sortClients(clients)

  clients.forEach(client => {
    const cardContent = `<article class="client-card">
    <h3 class="client-card__title">${client.name}</h3>
    <p class="client-card__address">${client.address}</p>
    <p class="client-card__zone">${client.city}</p>
    <p class="client-card__telephone">${client.phone}</p>
    <p class="client-card__email">${client.email}</p>
    </article>`
    const card = document.createElement('div')
    card.innerHTML = cardContent
    parentElement.appendChild(card)
  })
}

const filterClients = (array, param) => {
  return array.filter(item => item.name.toLowerCase().includes(param))
}

export const renderClientsFromSeller = (clients, parentElement) => {
  parentElement.innerHTML = ''

  if (clients.length > 0) {
    const searchInput = document.createElement('div')
    searchInput.classList.add('search-input')
    searchInput.innerHTML = ` 
      <input type="text" id="clients-filter" placeholder="Ingrese razón social" /> 
      <button class="button bg-secondary-300 bg-hover-secondary-400">Buscar</button>`
    parentElement.appendChild(searchInput)

    const clientsContainer = document.createElement('section')
    clientsContainer.classList.add('client-cards__container')
    parentElement.appendChild(clientsContainer)

    const $filterClients = document.querySelector('#clients-filter')

    const newClients = clients.filter(
      client => !client.name.toUpperCase().includes('ANULADA')
    )

    renderClients(newClients, clientsContainer)

    $filterClients.addEventListener('change', e => {
      const inputValue = e.target.value
      if (inputValue.length) {
        const filteredClients = filterClients(
          newClients,
          inputValue.toLowerCase()
        )

        renderClients(filteredClients, clientsContainer)
      } else {
        renderClients(newClients, clientsContainer)
      }
    })
  } else {
    parentElement.innerHTML = `<div>No se encontraron resultados.</div>`
  }
}
