import { checkLocalStorage } from './storage/profile.js'
import { renderClases } from './ui/store.js'
import { isMaintaining } from './ui/maintenance.js'

await checkLocalStorage()
renderClases()

if (window.location.href.includes('store')) {
  isMaintaining('.store-container')
}
