export function getUserFromStorage() {
  try {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user')
    return user || null
  } catch (error) {
    console.error(error)
    return null
  }
}
