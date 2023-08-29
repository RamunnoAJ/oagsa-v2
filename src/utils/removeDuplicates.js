/**
 * @param {string[]} array
 * @returns {string[]}
 * */
export const removeDuplicates = array => {
  return [...new Set(array)]
}
