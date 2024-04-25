function changePageTitle(title) {
    document.title = title
  }
  
  function generateInfoSection(src, estadosName) {
    const h2 = document.createElement('h2')
    h2.id = "info-estado-label"
    h2.textContent = `Informações sobre ${estadosName}`
  
    const img = document.querySelector('id')
    img.src = src
    img.alt = `Nome do Estado ${estadosName}`
  
    const section = document.querySelector('#info-estado')
  
    section.appendChild(h1)
    section.appendChild(img)
  }
  
  function getSearchParams() {
    // Early return -> Caso location search, não faz nada.
    if (!location.search) {
      return
    }
  
    // URLSearchParams é uma classe que facilita a manipulação de query strings
    const urlSearchParams = new URLSearchParams(location.search)
  
    // Pegando o valor do parâmetro name
    const pokemonName = urlSearchParams.get('name')
  
    changePageTitle(`Pagina do ${pokemonName}`)
    getPokemonData(pokemonName)
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    getSearchParams()
  })