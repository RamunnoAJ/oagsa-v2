/** @typedef {import('../entities/notes.js').Note} Note */

import { formatterTwoDigits } from './formatPrice.js'

/**
 * @param {string} category
 * @param {HTMLTableElement} htmlTable
 * @param {string} name
 * */
export function downloadPDF(category, htmlTable = null, name = '') {
  const table = htmlTable || document.querySelector('.table-container > table')

  const date = new Date()
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('/')

  const pdfWindow = window.open('', '_blank')

  pdfWindow.document.write(`
            <html lang="es">
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="OAGSA" />
                <meta name="description" content="OAGSA - ${category}" />
                <style type="text/css" media="print, screen">
                    @page {
                        size: auto;
                        margin: 10px 20px 10px 20px;
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
                    table img {
                        max-width: 3rem;
                    }
                </style>
            </head>
            <body>
                <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; align-items: center; gap: 40px">
                    <img src="../../assets/logo-oagsa.png" alt="OAGSA" width="200" />
                    <h1 style="text-align: center; font-size: 18px; display: flex; flex-direction: column; gap: 8px;"><span>${category}</span>${
                      name
                        ? `<span style="font-size: 14px;">${name}</span>`
                        : ''
                    }</h1>
                    <p style="text-color: #a0a0a0; font-weight: bold">${date}</p>
                </div>

                ${table.outerHTML}
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
export async function downloadNotas(notas, cantidadNotas, total) {
  const date = new Date()
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('/')

  const pdfWindow = window.open('', '_blank')
  pdfWindow.document.write(`
            <html>
            <head>
                <style type="text/css" media="print, screen">
                    @page {
                        size: auto;
                        margin: 10px 20px 10px 20px;
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
                <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; align-items: center; gap: 40px">
                    <img src="../../assets/logo-oagsa.png" alt="OAGSA" width="200" />
                    <h1 style="text-align: center; font-size: 18px">Notas de Pedidos</h1>
                    <p style="text-color: #a0a0a0; font-weight: bold">${date}</p>
                </div>
                <p>Número de Notas: <strong>${cantidadNotas}</strong></p>
                <p>Total: <strong>${formatterTwoDigits.format(
                  total,
                )}</strong></p>
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
                                <td style="text-align: center">${
                                  nota.date.split('T')[0]
                                } -
                                  ${nota.date.split('T')[1].split('.')[0]}</td>
                                <td>${nota.clientName}</td>
                                <td>${nota.sellerName}</td>
                                <td>${nota.observations}</td>
                                <td style="text-align: right">${formatterTwoDigits.format(
                                  nota.total,
                                )}</td>
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
