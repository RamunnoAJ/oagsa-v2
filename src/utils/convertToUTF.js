/**
 * @param {string} string
 * @returns {string}
 * */
export function convertToUTF(string) {
  return string
    .normalize('NFC')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/[^\w\sÑñ]/g, '')
}
