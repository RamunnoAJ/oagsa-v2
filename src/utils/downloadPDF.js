/**
 * @param {string} category
 * */
export function downloadPDF(category) {
  const table = document.querySelector('.table-container > table').outerHTML

  const pdfWindow = window.open('', '_blank')
  pdfWindow.document.write(`
            <html>
            <head>
                <title>OAGSA - ${category}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: center;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                ${table}
            </body>
            </html>
        `)
  pdfWindow.document.close()

  pdfWindow.onload = function () {
    pdfWindow.addEventListener('beforeprint', e => {
      e.preventDefault()
    })

    pdfWindow.addEventListener('afterprint', () => {
      pdfWindow.close()
    })

    pdfWindow.print()
  }
}
