export function sortClients(clients) {
  clients.sort((a, b) => {
    if (a?.razonSocial < b?.razonSocial) {
      return -1
    } else if (a?.razonSocial > b?.razonSocial) {
      return 1
    }
    return 0
  })
}
