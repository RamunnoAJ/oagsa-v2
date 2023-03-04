import getDataFromDB from './utils/getDataFromDB.js'

export const profileClientList = $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  getDataFromDB('http://api.oagsa.com/api/cliente/vendedor?pVendedor=1')
    .then(data => {
      $profileInfoContainer.innerHTML = ''

      const clientsFromData = data.data
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

const sortClients = clients => {
  clients.sort((a, b) => {
    if (a.razonSocial < b.razonSocial) {
      return -1
    } else if (a.razonSocial > b.razonSocial) {
      return 1
    }
    return 0
  })
}
