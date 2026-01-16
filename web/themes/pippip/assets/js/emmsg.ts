// ! Note - update 'hideEmergencyMessage' to be named after the project to avoid any possible clashes

import Cookies from 'js-cookie'

const emergencyMessage = document.querySelector('.m-emmsg')

if (emergencyMessage != null) {
  if (!Cookies.get('hideEmergencyMessage')) {
    emergencyMessage.setAttribute('data-state', 'visible')
  }

  const btn = document.querySelector('.m-emmsg__close')

  btn.addEventListener('click', e => {
    Cookies.set('hideEmergencyMessage', 'true', { expires: 30 })
    emergencyMessage.setAttribute('data-state', 'hidden')

    e.preventDefault()
  })
}
