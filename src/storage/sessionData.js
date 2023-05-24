export function saveToSessionStorage(key) {
  sessionStorage.setItem('user', key)
}

export function getFromSessionStorage(key) {
  sessionStorage.getItem(key)
}

export function deleteFromSessionStorage(key) {
  sessionStorage.removeItem(key)
}
