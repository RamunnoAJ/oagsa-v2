export class ArticlePrice {
  /**
   * @param {string} id
   * @param {string} description
   * @param {string} brand
   * @param {string} diameter
   * @param {string} measure
   * @param {number} price
   * @param {number} priceDiscount
   * @param {number} discount
   * @param {string[]} images
   */
  constructor(
    id,
    name,
    brand,
    diameter,
    measure,
    price,
    priceDiscount,
    discount,
    images
  ) {
    this.id = id
    this.name = name
    this.brand = brand
    this.diameter = diameter
    this.measure = measure
    this.price = price
    this.priceDiscount = priceDiscount
    this.discount = discount
    this.images = images
  }
}
