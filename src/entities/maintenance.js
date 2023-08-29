export class Maintenance {
  /**
   * @typedef {Maintenance}
   * @param {string} name
   * @param {string} description
   * @param {string} value
   * @param {string} date
   * */
  constructor(name, description, value, date) {
    this.name = name
    this.description = description
    this.value = value
    this.date = date
  }
}
