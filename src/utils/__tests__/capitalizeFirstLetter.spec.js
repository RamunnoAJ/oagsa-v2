import { capitalizeFirstLetter } from '../capitalizeFirstLetter.js'

describe('capitalizeFirstLetter', () => {
  test('should capitalize first letter', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello')
  })
})
