import { renderProfileEditImages } from './ui/profileEditImages.js'

/**
 * @param {HTMLDivElement} parentElement
 * */
export function profileEditImages(parentElement) {
  parentElement.innerHTML = '<span class="loader"></span>'

  renderProfileEditImages(parentElement)
}
