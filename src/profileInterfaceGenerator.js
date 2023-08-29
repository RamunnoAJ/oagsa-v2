import { renderInterfaceGenerator } from './ui/profileInterfaceGenerator.js'

export function profileInterfaceGenerator(parentElement) {
  parentElement.innerHTML = '<span class"loader"></span>'

  renderInterfaceGenerator(parentElement)
}
