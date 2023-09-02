/**
 * @param {string} dateString
 * @return {boolean}
 * */
export function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/
  return dateString.match(regEx) !== null
}
