import getDataFromDB from '../utils/getDataFromDB.js'

export async function getUserLogin(user, password) {
  const response = await getDataFromDB(
    `login/login?pUsuario=${user}&pPassword=${password}`
  )
  const loggedUser = await response.data

  return loggedUser
}
