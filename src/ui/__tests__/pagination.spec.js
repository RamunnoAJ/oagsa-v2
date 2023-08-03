import { renderPaginationButtons } from '../pagination.js'

document.body.innerHTML = '<div class="parent"></div>'

describe('renderPaginationButtons', () => {
  test('should render pagination buttons', () => {
    const previous = 1
    const next = 2
    const renderFunction = jest.fn()
    const $parent = document.querySelector('.parent')
    renderPaginationButtons(previous, next, renderFunction, $parent)

    expect(document.querySelectorAll('.button-sm')).toHaveLength(4)
  })

  test('should delete remove the pagination if already exists to create other', () => {
    document.body.innerHTML =
      '<div class="parent"><div class="pagination deleted"></div></div>'

    const $parent = document.querySelector('.parent')
    const previous = 1
    const next = 2
    const renderFunction = jest.fn()

    expect($parent.querySelector('.pagination').className).toContain('deleted')

    renderPaginationButtons(previous, next, renderFunction, $parent)

    expect($parent.querySelector('.pagination').className).not.toContain(
      'deleted'
    )
  })

  test('should disable the buttons next and previous if they are null', () => {
    const previous = null
    const next = null
    const renderFunction = jest.fn()
    const $parent = document.querySelector('.parent')

    renderPaginationButtons(previous, next, renderFunction, $parent)

    expect($parent.querySelector('#btn-next').disabled).toBe(true)
    expect($parent.querySelector('#btn-prev').disabled).toBe(true)
  })

  test('renderFunction should trigger if the buttons are clicked', () => {
    const previous = 1
    const next = 2
    const renderFunction = jest.fn()
    const $parent = document.querySelector('.parent')

    renderPaginationButtons(previous, next, renderFunction, $parent)

    const $btnFirst = document.querySelector('#btn-first')
    const $btnPrev = document.querySelector('#btn-prev')
    const $btnNext = document.querySelector('#btn-next')
    const $btnLast = document.querySelector('#btn-last')

    $btnFirst.click()
    expect(renderFunction).toHaveBeenCalledWith(1)
    $btnPrev.click()
    expect(renderFunction).toHaveBeenCalledWith(1)
    $btnNext.click()
    expect(renderFunction).toHaveBeenCalledWith(2)
    $btnLast.click()
    expect(renderFunction).toHaveBeenCalledWith(3)

    expect(renderFunction).toHaveBeenCalledTimes(4)
  })
})
