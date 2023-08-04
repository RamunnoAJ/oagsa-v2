import { createModal, createOverlay } from '../modal.js'

describe('Modal', () => {
  test('should return a modal element', async () => {
    const $modal = await createModal()
    expect($modal).toBeTruthy()
  })

  test('should return an overlay element', async () => {
    document.body.innerHTML =
      '<div class="modal"></div><div class="overlay"></div>'

    const $overlay = await createOverlay()
    expect($overlay).toBeTruthy()

    $overlay.click()
  })
})
