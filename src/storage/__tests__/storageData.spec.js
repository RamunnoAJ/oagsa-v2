import { getUserFromStorage } from '../storageData.js'

describe('getUserFromStorage', () => {
  it('should return null when user is not found in storage', () => {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
    expect(getUserFromStorage()).toBeNull()
  })

  it('should return user when found in sessionStorage', () => {
    const user = 'test-user'
    sessionStorage.setItem('user', user)
    expect(getUserFromStorage()).toEqual(user)
  })

  it('should return user when found in localStorage', () => {
    const user = 'test-user'
    localStorage.setItem('user', user)
    expect(getUserFromStorage()).toEqual(user)
  })
})
