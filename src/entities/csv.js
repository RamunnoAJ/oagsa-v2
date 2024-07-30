export class csvExport {
  constructor(table, header = true) {
    this.table = table
    this.rows = Array.from(table.querySelectorAll('tr'))
    if (!header && this.rows[0].querySelectorAll('th').length) {
      this.rows.shift()
    }
  }

  exportCsv() {
    const lines = []
    const ncols = this._longestRow()
    for (const row of this.rows) {
      let line = ''
      for (let i = 0; i < ncols; i++) {
        if (row.children[i] !== undefined) {
          line += csvExport.safeData(row.children[i])
        }
        line += i !== ncols - 1 ? ',' : ''
      }
      lines.push(line)
    }
    return lines.join('\n')
  }
  _longestRow() {
    return this.rows.reduce(
      (length, row) =>
        row.childElementCount > length ? row.childElementCount : length,
      0
    )
  }
  static safeData(td) {
    let data = td.textContent
    data = data.replace(/"/g, `""`)
    data = /[",\n"]/.test(data) ? `"${data}"` : data
    return data
  }
}
