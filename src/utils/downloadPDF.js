import { Note } from '../entities/notes.js'

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

/**
 * @param {Note[]} notas
 * @param {number} cantidadNotas
 * @param {number} total
 * */
export function downloadNotas(notas, cantidadNotas, total) {
  const pdfWindow = window.open('', '_blank')
  pdfWindow.document.write(`
            <html>
            <head>
                <style type="text/css" media="print, screen">
                    @page {
                        size: auto;
                        margin: 0.3in 0.7in 0.3in 0.7in;
                    }
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
                <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 20px">
                    <img src="../../assets/logo-oagsa.png" alt="OAGSA" width="200" />
                    <h1 style="text-align: center; font-size: 18px">Notas de Pedidos</h1>
                    <p>Fecha: ${new Date().toISOString().split('T')[0]}</p>
                </div>
                <p>Número de Notas: <strong>${cantidadNotas}</strong></p>
                <p>Total: <strong>$${total}</strong></p>
                <table>
                    <thead>
                        <tr style="font-weight: bold;">
                            <th>N Nota</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Vendedor</th>
                            <th>Observación</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${notas.map(
                          nota => `
                            <tr style="font-size: 12px">
                                <td style="font-weight: bold">${nota.id}</td>
                                <td style="text-align: center">${nota.date.split('T')[0]}</td>
                                <td>${nota.clientName}</td>
                                <td>${nota.sellerName}</td>
                                <td>${nota.observations}</td>
                                <td style="text-align: right">$${nota.total}</td>
                                <td>${nota.status}</td>
                            </tr>`,
                        )}
                    </tbody>
                </table>
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
