export function sortClients(clients) {
  clients.sort((a, b) => {
    if (a?.name < b?.name) {
      return -1
    } else if (a?.name > b?.name) {
      return 1
    }
    return 0
  })
}
