import {
  downloadFile,
  getPrepararNotas,
} from '../api/profileInterfaceGenerator.js'
import { showToast } from '../utils/showToast.js'

export function renderInterfaceGenerator(parentElement) {
  parentElement.innerHTML = ''

  const $container = document.createElement('div')
  $container.className = 'interface__generator__container'

  const $buttonPrepare = document.createElement('button')
  $buttonPrepare.className =
    'button-sm bg-error-400 bg-hover-error-300 text-white'
  $buttonPrepare.textContent = 'Generar Interfaces'
  $buttonPrepare.addEventListener('click', e => {
    getPrepararNotas().then(() => {
      showToast('Interfaces generadas')
    })
  })

  const $buttonDownload = document.createElement('button')
  $buttonDownload.className =
    'button-sm bg-success-400 text-white bg-hover-success'
  $buttonDownload.textContent = 'Descargar Última Interfaz'
  $buttonDownload.addEventListener('click', e => {
    downloadFile()
  })

  $container.appendChild($buttonPrepare)
  $container.appendChild($buttonDownload)

  parentElement.appendChild($container)
}
