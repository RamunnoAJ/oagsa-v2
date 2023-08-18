import { formatDate } from '../formatDate.js'

describe('formatDate', () => {
  test('returns a formatted date', () => {
    expect(formatDate('2021-01-01')).toBe('01-01-2021')
  })
})
