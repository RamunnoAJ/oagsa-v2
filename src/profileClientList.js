import getDataFromDB from './utils/getDataFromDB.js'
import { sortClients } from './utils/sortClients.js'
import { getStorageID } from './storage/profileClientList.js'

export const profileClientList = $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()

  getDataFromDB(
    `http://api.oagsa.com/api/cliente/vendedor?pVendedor=${sellerID}`
  )
    .then(response => {
      $profileInfoContainer.innerHTML = ''

      if (response.data.length > 0) {
        const clientsFromData = response.data
        const searchInput = document.createElement('div')
        searchInput.classList.add('search-input')
        searchInput.innerHTML = ` 
      <input type="text" id="clients-filter" placeholder="Ingrese razón social" /> 
      <button class="button bg-secondary-300 bg-hover-secondary-400">Buscar</button>`
        $profileInfoContainer.appendChild(searchInput)

        const clientsContainer = document.createElement('section')
        clientsContainer.classList.add('client-cards__container')
        $profileInfoContainer.appendChild(clientsContainer)

        const $filterClients = document.querySelector('#clients-filter')

        const clients = clientsFromData.filter(
          client => !client.razonSocial.toUpperCase().includes('ANULADA')
        )

        renderClients(clients, clientsContainer)

        $filterClients.addEventListener('change', e => {
          if (e.target.value.length) {
            const filteredClients = filterClients(
              clients,
              e.target.value.toLowerCase()
            )
            renderClients(filteredClients, clientsContainer)
          } else {
            renderClients(clients, clientsContainer)
          }
        })
      } else {
        $profileInfoContainer.innerHTML = `<div>No se encontraron resultados</div>`
      }
    })
    .catch(error => {
      console.log(error)
    })
}

const renderClients = (clients, parent) => {
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

const filterClients = (array, param) => {
  return array.filter(item => item.razonSocial.toLowerCase().includes(param))
}
