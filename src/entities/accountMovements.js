export class Movement {
  /**
   * @typedef {Movement}
   * @param {number} id
   * @param {number} idClient
   * @param {number} idSeller
   * @param {number} idZone
   * @param {string} date
   * @param {string} expirationDate
   * @param {string} share
   * @param {string} voucher
   * @param {string} letter
   * @param {string} sellPoint
   * @param {string} number
   * @param {number} amount
   * @param {number} pending
   * */
  constructor(
    id,
    idClient,
    idSeller,
    idZone,
    date,
    expirationDate,
    share,
    voucher,
    letter,
    sellPoint,
    number,
    amount,
    pending
  ) {
    this.id = id
    this.idClient = idClient
    this.idSeller = idSeller
    this.idZone = idZone
    this.date = date
    this.expirationDate = expirationDate
    this.share = share
    this.voucher = voucher
    this.letter = letter
    this.sellPoint = sellPoint
    this.number = number
    this.amount = amount
    this.pending = pending
  }
}
