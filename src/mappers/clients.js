import { Client } from '../entities/clients.js'

/* @typeof {import('../entities/clients.js').Client} Client */

/*
 * @param {object} apiData
 * @return {Client}
 * */
export function clientsMapper(apiData) {
  const {
    codigoCliente,
    razonSocial,
    direccion,
    localidad,
    codigoPostal,
    telefono,
    fax,
    email,
    codigoVendedor,
    codigoZona,
    cuit,
  } = apiData

  return new Client(
    codigoCliente,
    razonSocial,
    direccion,
    localidad,
    codigoPostal,
    telefono,
    fax,
    email,
    codigoVendedor,
    codigoZona,
    cuit
  )
}
