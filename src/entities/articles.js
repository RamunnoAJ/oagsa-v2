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

export class Article {
  /**
   * @typedef {Article}
   * @param {number} id
   * @param {number} idCategory
   * @param {number} idSubcategory
   * @param {string} name
   * @param {string} diameter
   * @param {string} brand
   * @param {string} measure
   * @param {boolean} cover
   * @param {number} price
   * @param {number} isInWeb
   * @param {string} stockColor
   * @param {number} stock
   * @param {string[]} images
   * */
  constructor(
    id,
    idCategory,
    idSubcategory,
    name,
    diameter,
    brand,
    measure,
    cover,
    price,
    isInWeb,
    stockColor,
    stock,
    images
  ) {
    this.id = id
    this.idCategory = idCategory
    this.idSubcategory = idSubcategory
    this.name = name
    this.diameter = diameter
    this.brand = brand
    this.measure = measure
    this.cover = cover
    this.price = price
    this.isInWeb = isInWeb
    this.stockColor = stockColor
    this.stock = stock
    this.images = images
  }
}
