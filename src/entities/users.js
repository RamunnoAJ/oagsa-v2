export class User {
  /**
   * @typedef {User}
   * @param {number} id
   * @param {string} name
   * @param {number} idSeller
   * @param {number} idBejerman
   * @param {number} idUser
   * @param {number} role
   * @param {string} powerBILink
   * */
  constructor(id, name, idSeller, idBejerman, idUser, role, powerBILink) {
    this.id = id
    this.name = name
    this.idSeller = idSeller
    this.idBejerman = idBejerman
    this.idUser = idUser
    this.role = role
    this.powerBILink = powerBILink
  }
}
