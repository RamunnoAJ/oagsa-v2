import { getStorageID } from './storage/profileClientList.js'
import { filterClients, renderClients } from './ui/profileClientList.js'
import { getClientsFromSeller } from './api/profileClientList.js'

export const profileClientList = $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()

  getClientsFromSeller(`vendedor?pVendedor=${sellerID}`)
    .then(response => {
      $profileInfoContainer.innerHTML = ''

      if (response.length > 0) {
        const clientsFromData = response
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
