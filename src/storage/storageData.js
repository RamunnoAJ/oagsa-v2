export function getUserFromStorage() {
  return sessionStorage.getItem('user') || localStorage.getItem('user')
}
