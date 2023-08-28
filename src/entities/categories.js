export class Category {
  /**
   * @typedef {Category}
   * @param {string} id
   * @param {string} name
   * */
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}

export class Subcategory {
  /**
   * @typedef {Subcategory}
   * @param {string} id
   * @param {string} idCategory
   * @param {string} name
   * */
  constructor(id, idCategory, name) {
    this.id = id
    this.idCategory = idCategory
    this.name = name
  }
}

export class Class {
  /**
   * @typedef {Class}
   * @param {string} id
   * @param {string} name
   * */
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
