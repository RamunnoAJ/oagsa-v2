export class Freight {
  /**
   * @typedef Freight
   * @param {number} id
   * @param {string} description
   * @param {number} order
   * @param {string} legend
   * */
  constructor(id, description, order, legend) {
    this.id = id
    this.description = description
    this.order = order
    this.legend = legend
  }
}
