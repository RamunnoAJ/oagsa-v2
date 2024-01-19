import { renderCustomerPreload } from './ui/profileCustomerPreload.js'

export function profileCustomerPreload(parentElement) {
  parentElement.innerHTML = '<span class"loader"></span>'

  renderCustomerPreload(parentElement)
}
