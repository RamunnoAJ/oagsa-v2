import { userMapper } from '../mappers/users.js'
import getDataFromDB from '../utils/getDataFromDB.js'

/** @typedef {import('../entities/users.js').User} User */

/**
 * @param {string} user
 * @param {string} password
 * @return {User}
 */
export async function getUserLogin(user, password) {
  const response = await getDataFromDB(
    `login/login?pUsuario=${user}&pPassword=${password}`
  )
  const userApi = await response.data
  const loggedUser = userMapper(userApi)

  return loggedUser
}
