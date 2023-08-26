import { User } from '../entities/users.js'
/** @typedef {import('../entities/users.js').User} User */

/**
 * @param {object} apiData
 * @return {User}
 * */
export function userMapper(apiData) {
  const {
    id,
    nombreUsuario,
    codigoVendedor,
    codigoBejerman,
    codigoUsuario,
    nivelAcceso,
  } = apiData

  return new User(
    id,
    nombreUsuario,
    codigoVendedor,
    codigoBejerman,
    codigoUsuario,
    nivelAcceso
  )
}
