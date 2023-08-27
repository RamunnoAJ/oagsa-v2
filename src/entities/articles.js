export class ArticleOrder {
  /**
   * @typedef {ArticleOrder}
   * @param {number} idOrder
   * @param {number} id
   * @param {string} name
   * @param {number} price
   * @param {number} quantity
   * @param {number} quantityDelivered
   * @param {string} idDiscount
   * @param {string} discount
   * @param {number} discountPercentage
   * @param {number} total
   * @param {number} totalDiscount
   * @param {number} priceDiscount
   * @param {number} priceTotal
   * @param {number} orderNumber
   * @param {boolean} deleted
   * @param {string[]} images
   * */
  constructor(
    idOrder,
    id,
    name,
    price,
    quantity,
    quantityDelivered,
    idDiscount,
    discount,
    discountPercentage,
    total,
    totalDiscount,
    priceDiscount,
    priceTotal,
    orderNumber,
    deleted,
    images
  ) {
    this.idOrder = idOrder
    this.id = id
    this.name = name
    this.price = price
    this.quantity = quantity
    this.quantityDelivered = quantityDelivered
    this.idDiscount = idDiscount
    this.discount = discount
    this.discountPercentage = discountPercentage
    this.total = total
    this.totalDiscount = totalDiscount
    this.priceDiscount = priceDiscount
    this.priceTotal = priceTotal
    this.orderNumber = orderNumber
    this.deleted = deleted
    this.images = images
  }
}
