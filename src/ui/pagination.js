function createPaginationButtons() {
  const $pagination = document.createElement('div')
  $pagination.className = 'pagination mt-5'
  $pagination.innerHTML = `
    <button class="btn btn-pagination" id="btn-first"> << </button>
    <button class="btn btn-pagination" id="btn-prev">Anterior</button>
    <button class="btn btn-pagination" id="btn-next">Siguiente</button>
    <button class="btn btn-pagination" id="btn-last"> >> </button>
    `

  return $pagination
}

export function renderPaginationButtons(
  previous,
  next,
  renderFunction,
  parentElement
) {
  const $pagination = createPaginationButtons()
  parentElement.appendChild($pagination)

  const $btnPrev = document.querySelector('#btn-prev')
  const $btnNext = document.querySelector('#btn-next')

  $btnPrev.addEventListener('click', () => {
    renderFunction(previous)
  })

  $btnNext.addEventListener('click', () => {
    renderFunction(next)
  })
}
