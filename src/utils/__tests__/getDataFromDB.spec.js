import { getDataFromDB } from '../getDataFromDB.js'

describe('getDataFromDB', () => {
  beforeAll(() => {
    global.fetch = jest.fn()
  })

  test('should call fetch without errors', async () => {
    global.fetch.mockImplementationOnce(
          () =>
            new Promise(resolve => {
              const jsonPromise = new Promise(r => {
                r()
              })
              resolve({ ok: true, json: () => jsonPromise })
            })
        )

    await getDataFromDB('test')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('http://api.oagsa.com/api/test')
  })

  test('should throw an error when the response is not ok', () => {
    global.fetch.mockImplementationOnce(
          () =>
            new Promise(resolve => {
              const jsonPromise = new Promise(r => {
                r()
              })
              resolve({ ok: false, json: () => jsonPromise })
            })
        )

    expect(getDataFromDB('test')).rejects.toEqual(new Error('Respuesta rechazada'))
  })

  test('should throw an error when the parameter passed is not of type string', () => {
    global.fetch.mockImplementationOnce(
          () =>
            new Promise(resolve => {
              const jsonPromise = new Promise(r => {
                r()
              })
              resolve({ ok: true, json: () => jsonPromise })
            })
        )

    expect(getDataFromDB(true)).rejects.toEqual(new Error('url must be a string'))
  })
})
