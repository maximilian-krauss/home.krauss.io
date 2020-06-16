function attachHits(hits) {
  const elements = document.getElementsByClassName('byline-meta-content')
  if (!elements) return
  const element = document.createElement('span')
  element.innerHTML = `<span class="bull">•</span> ${hits} views`
  elements[0].appendChild(element)
}

async function sendPing() {
  const page = encodeURIComponent(this.window.location.pathname || '/')
  const response = await fetch(`https://api.krauss.io/ping?p=${page}`)
  if (!response.ok) return
  const responseBody = await response.json()
  attachHits(responseBody.hits)
}

sendPing()
  .catch(err => console.error(err))