export function getUserFromStorage() {
  try {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user')
    if (!user) throw new Error('User not found in storage')
    return user
  } catch (error) {
    console.error(error)
    return null
  }
}
