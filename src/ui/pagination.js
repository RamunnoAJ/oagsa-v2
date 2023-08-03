function createPaginationButtons() {
  const $pagination = document.createElement('div')
  $pagination.className = 'pagination mt-5'
  $pagination.innerHTML = `
    <button class="button-sm bg-slate" id="btn-first"> << </button>
    <button class="button-sm bg-slate" id="btn-prev">Anterior</button>
    <button class="button-sm bg-slate" id="btn-next">Siguiente</button>
    <button class="button-sm bg-slate" id="btn-last"> >> </button>
    `

  return $pagination
}

export function renderPaginationButtons(
  previous,
  next,
  renderFunction,
  parentElement
) {
  if (document.querySelector('.pagination')) {
    document.querySelector('.pagination').remove()
  }

  const FIRST_PAGE = 1
  const LAST_PAGE = 3

  const $pagination = createPaginationButtons()
  parentElement.appendChild($pagination)

  const $btnFirst = document.querySelector('#btn-first')
  const $btnPrev = document.querySelector('#btn-prev')
  const $btnNext = document.querySelector('#btn-next')
  const $btnLast = document.querySelector('#btn-last')

  if (!previous) $btnPrev.disabled = true
  if (next > LAST_PAGE || !next) $btnNext.disabled = true

  $btnPrev.addEventListener('click', () => {
    renderFunction(previous)
  })

  $btnNext.addEventListener('click', () => {
    renderFunction(next)
  })

  $btnFirst.addEventListener('click', () => {
    renderFunction(FIRST_PAGE)
  })

  $btnLast.addEventListener('click', () => {
    renderFunction(LAST_PAGE)
  })
}
