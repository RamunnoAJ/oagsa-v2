import { getDolar } from './api/dolar.js'
import { getMaintenance } from './api/maintenance.js'
import { renderProfileAdministration } from './ui/profileAdministration.js'

export async function profileAdministration(parentElement) {
  parentElement.innerHTML = `<span class="loader"></span>`

  const dolar = await getDolar()
  const maintenance = await getMaintenance()

  renderProfileAdministration(dolar, maintenance, parentElement)
}
