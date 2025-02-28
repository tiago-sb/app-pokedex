const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}" onclick="pokemonDetail('${pokemon.name}')">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join('')
    pokemonList.innerHTML += newHtml
  })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
  offset += limit
  const qtdRecordsWithNexPage = offset + limit

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset
    loadPokemonItens(offset, newLimit)

    loadMoreButton.parentElement.removeChild(loadMoreButton)
  } else {
    loadPokemonItens(offset, limit)
  }
})

async function showPokemonAttributes(pokemon, contentPokemon, pokemonAttributes) {
  
    const pokemonHead = document.getElementById('pokemonHead')
    
    const aboutPokemon = await pokeApi.getDetailsAbout(pokemon.id) || {}
    const [type] = pokemon.types

    contentPokemon.classList.add(`${type.type.name}`)
    pokemonHead.innerHTML = `
      <div class="span">
        <span class="name">${pokemon.name}</span>  
        <span class="number">#${pokemon.id}</span>
      </div>
      <div class="detail"> 
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('')}
        </ol>
        <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
      </div>
    `
    console.log(aboutPokemon, pokemon)
    pokemonAttributes.innerHTML = `
      <div id="listAbilities">
        <h2>Atributos do ${pokemon.name}</h2>
        <div>
          <div>
            <h3>Altura</h3>
            <p>${Math.round(aboutPokemon.height / 10) || 'sem valor'} m</p>
          </div>
          <div>
            <h3>Peso</h3>
            <p>${Math.round(aboutPokemon.weight * 0.1) || 'sem valor'} kg</p>
          </div>
        </div>
        
        <div>
          <h3>Gênero</h3>
          <ul>
            <li>fêmea ${aboutPokemon.gender_rate.fema || 'sem valor'}%</li>
            <li>macho ${aboutPokemon.gender_rate.macho || 'sem valor'}%</li>
          </ul>
        </div>
        
        <div>
          <div>
            <h3>Forma</h3>
            <p>${aboutPokemon.shape || 'sem valor'}</p>
          </div>
          <div>
            <h3>Cor Natural</h3>
            <p>${aboutPokemon.color || 'sem valor'}</p>
          </div>
          <div>
            <h3>Habitat Natural</h3>
            <p>${aboutPokemon.habitat || 'sem valor'}</p>
          </div>
          <div>
            <h3>Geração</h3>
            <p>${aboutPokemon.generation || 'sem valor'}</p>
          </div>
        <div>
      </div>
    `
    
    contentPokemon.style.display = 'block'
}

function loadPokemonDetailsScreen(detailsPoke) {
  const contentPokemon = document.getElementById('contentPokemon')
  const contentPokemons = document.getElementById('contentPokemons')
  const backButton = document.getElementById('backButton')
  const pokemonAttributes = document.getElementById('pokemonAttributes')

  const [type] = detailsPoke.types
  
  showPokemonAttributes(detailsPoke, contentPokemon, pokemonAttributes)
  contentPokemons.style.filter = 'blur(1px)'
  
  backButton.addEventListener('click', () => {
    contentPokemon.style.display = 'none'
    contentPokemons.style.filter = 'blur(0px)'
    contentPokemon.classList.remove(`${type.type.name}`)
  })
}

function pokemonDetail(pokeName) {
  pokeApi.getPokemonDetailId(pokeName)
    .then((pokemon) => loadPokemonDetailsScreen(pokemon))
}