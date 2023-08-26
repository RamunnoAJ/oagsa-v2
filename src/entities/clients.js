export class Client {
  /**
   * @typedef {Client}
   * @param {number} id - ID of the client, it's used as unique identifier
   * @param {string} name - Name of the client
   * @param {string} address - Address of the client
   * @param {string} city - City of the client
   * @param {string} zip - Zip code of the zone where the client is located
   * @param {string} phone - Phone number
   * @param {string} fax - Fax number
   * @param {string} email - Email
   * @param {number} idSeller - ID of the seller
   * @param {number} idZone - ID of the zone
   * @param {string} cuit - CUIT
   * */
  constructor(
    id,
    name,
    address,
    city,
    zip,
    phone,
    fax,
    email,
    idSeller,
    idZone,
    cuit
  ) {
    this.id = id
    this.name = name
    this.address = address
    this.city = city
    this.zip = zip
    this.phone = phone
    this.fax = fax
    this.email = email
    this.idSeller = idSeller
    this.idZone = idZone
    this.cuit = cuit
  }
}
