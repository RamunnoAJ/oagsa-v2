export class ArticlePrice {
  /**
   * @param {string} id
   * @param {string} description
   * @param {string} brand
   * @param {string} diameter
   * @param {string} measure
   * @param {number} price
   * @param {number} discount
   */
  constructor(id, description, brand, diameter, measure, price, discount) {
    this.id = id
    this.description = description
    this.brand = brand
    this.diameter = diameter
    this.measure = measure
    this.price = price
    this.discount = discount
  }
}
