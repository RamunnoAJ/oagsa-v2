import { renderProfileEditImages } from './ui/profileEditImages.js'

export function profileEditImages(parentElement) {
  parentElement.innerHTML = '<span class="loader"></span>'

  renderProfileEditImages(parentElement)
}
