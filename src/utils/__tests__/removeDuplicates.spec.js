import { removeDuplicates } from '../removeDuplicates.js'

describe('removeDuplicates', () => {
  test('should remove the duplicates from an array', () => {
    expect(removeDuplicates([1, 2, 3, 4, 5, 5])).toEqual([1, 2, 3, 4, 5])
  })
})
