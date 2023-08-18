import { checkLocalStorage } from './storage/profile.js'
import { renderClases, renderDolar } from './ui/store.js'
import { isMaintaining } from './ui/maintenance.js'

await checkLocalStorage()
renderDolar()
renderClases()

if (window.location.href.includes('store')) {
  isMaintaining('.store-container')
}
