import { renderClases, renderDolar } from './ui/store.js'
import { isMaintaining } from './ui/maintenance.js'

renderDolar()
renderClases()

if (window.location.href.includes('store')) {
  isMaintaining('.store-container')
}
