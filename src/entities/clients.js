export class Client {
  /*
   * @param {number} id
   * @param {string} name
   * @param {string} address
   * @param {string} city
   * @param {string} zip
   * @param {string} phone
   * @param {string} fax
   * @param {string} email
   * @param {number} idSeller
   * @param {number} idZone
   * @param {string} cuit
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
