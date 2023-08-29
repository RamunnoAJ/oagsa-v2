/** @typedef {import('./articles.js').ArticleOrder} ArticleOrder */

export class Order {
  /**
   * @typedef {Order}
   * @param {number} id
   * @param {number} idClient
   * @param {number} idSellCondition
   * @param {string} observations
   * @param {number} orderOrigin
   * @param {string} status
   * @param {number} total
   * @param {number} items
   * @param {number} idSeller
   * @param {string} date
   * @param {number} draft
   * @param {number} idFreight
   * @param {string} freight
   * @param {ArticleOrder[]} detail
   * */
  constructor(
    id,
    idClient,
    idSellCondition,
    observations,
    orderOrigin,
    status,
    total,
    items,
    idSeller,
    date,
    draft,
    idFreight,
    freight,
    detail
  ) {
    this.id = id
    this.idClient = idClient
    this.idSellCondition = idSellCondition
    this.observations = observations
    this.orderOrigin = orderOrigin
    this.status = status
    this.total = total
    this.items = items
    this.idSeller = idSeller
    this.date = date
    this.draft = draft
    this.idFreight = idFreight
    this.freight = freight
    this.detail = detail
  }
}