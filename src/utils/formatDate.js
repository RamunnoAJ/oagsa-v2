/**
 * @param {string} date
 * @returns {string}
 * */
export function formatDate(date) {
  return date.split('-').reverse().join('-')
}
