import getDataFromDB from '../utils/getDataFromDB.js'

export async function getAccountMovements(url) {
  const response = await getDataFromDB(url)
  console.log(response)
}
