async function createDashboard(list) {
  const $dashboardWrapper = document.createElement('div')
  $dashboardWrapper.className = 'dashboard-wrapper'

  const $profileContainer = document.createElement('div')
  $profileContainer.className = 'profile-container'

  const $profileTitle = document.createElement('h1')
  $profileTitle.className = 'uppercase'
  $profileTitle.textContent = 'Funciones'

  const $profileContainerList = document.createElement('ul')
  $profileContainerList.className = 'profile-container__list'
  $profileContainerList.id = 'profileList'

  list.forEach(item => {
    $profileContainerList.innerHTML += `<li>${item}</li>`
  })

  $profileContainerList.innerHTML += `<li><a href="./store.html">Tienda</a></li>`

  const $profileInfo = document.createElement('div')
  $profileInfo.className = 'profile-info'

  const $profileInfoTitle = document.createElement('h2')
  $profileInfoTitle.className = 'profile-info__title uppercase'
  $profileInfoTitle.id = 'profileTitle'

  const $profileInfoContainer = document.createElement('div')
  $profileInfoContainer.className = 'profile-info__container'
  $profileInfoContainer.id = 'profileInfoContainer'

  $profileContainer.appendChild($profileTitle)
  $profileContainer.appendChild($profileContainerList)

  $profileInfo.appendChild($profileInfoTitle)
  $profileInfo.appendChild($profileInfoContainer)

  $dashboardWrapper.appendChild($profileContainer)
  $dashboardWrapper.appendChild($profileInfo)

  return $dashboardWrapper
}

export async function renderDashboard(parentElement, list) {
  const $dashboard = await createDashboard(list)

  parentElement.classList.remove('mb-64')
  parentElement.appendChild($dashboard)
}

export async function renderTitle(parentElement, title) {
  parentElement.textContent = title
}
