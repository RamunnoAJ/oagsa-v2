import { checkLocalStorage } from './storage/profile.js'
import { renderClases } from './ui/store.js'

await checkLocalStorage()
renderClases()
