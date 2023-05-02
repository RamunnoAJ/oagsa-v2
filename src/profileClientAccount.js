import {
  getStorageID,
  getDataFromStorage,
} from './storage/profileClientAccount.js'
import {
  renderClientAccount,
  renderOptions,
} from './ui/profileClientAccount.js'

export const profileClientAccount = async $profileInfoContainer => {
  $profileInfoContainer.innerHTML = '<span class="loader"></span>'

  const sellerID = getStorageID()
  const response = await getDataFromStorage(sellerID)
  const clients = await response.data

  if (clients.length > 0) {
    $profileInfoContainer.innerHTML = `
    <span class="profile-info__subtitle">Razón social:</span>
      <form class="profile-info__search" id='client-form'>
        <select id="selectClient" name='selectedClient' class="select bg-primary mr-4">
          <option disabled selected value=''>Selecione una opción...</option>
        </select>
        <button class="button bg-secondary-300 bg-hover-secondary-400" id="btnSearch"> <span
            class="visually-hidden-mobile">Buscar</span>
          <span class="visually-hidden-desktop">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span> </button>
          </form>
          <div class='table-container'></div>
          `

    renderOptions(clients)

    const $btnSearch = document.querySelector('#btnSearch')
    $btnSearch.addEventListener('click', handleSubmit)
  } else {
    $profileInfoContainer.innerHTML = `<div>No se encontraron resultados</div>`
  }
}

const handleSubmit = e => {
  e.preventDefault()
  const $form = document.querySelector('#client-form')
  const selectedClient = $form.selectedClient.value

  if (selectedClient) {
    renderClientAccount(selectedClient)
  }
}
