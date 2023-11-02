export class Note {
  /**
   * @param {number} id
   * @param {number} origin
   * @param {number} idClient
   * @param {number} idSeller
   * @param {number} idFreight
   * @param {number} idSellCondition
   * @param {number} draft
   * @param {string} date
   * @param {string} status
   * @param {number} total
   * @param {number} items
   * @param {string} observations
   */
  constructor(
    id,
    orderOrigin,
    idClient,
    idSeller,
    idFreight,
    idSellCondition,
    draft,
    date,
    status,
    total,
    items,
    observations
  ) {
    this.id = id
    this.orderOrigin = orderOrigin
    this.idClient = idClient
    this.idSeller = idSeller
    this.idFreight = idFreight
    this.idSellCondition = idSellCondition
    this.draft = draft
    this.date = date
    this.status = status
    this.total = total
    this.items = items
    this.observations = observations
  }
}
