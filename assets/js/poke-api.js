const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonDetailId = (pokeId) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokeId}`
  
  return fetch(url)
    .then((response) => response.json())
}

function fetchPokemon(token) {
  const url = `https://pokeapi.co/api/v2/${token}`

  return fetch(url)
    .then((response) => response.json())
}

function genderStatistics(chance) {
  if (chance === -1) {
    return {
      femea: 0,
      macho: 0
    }
  } else {
    let femea = (chance / 8) * 100
    let macho = 100 - femea
    
    return {
      fema: femea,
      macho: macho
    }
  }
}

function convertPokeApiDetailToAbout(pokeDetails) {
  const chanchePokeGender = genderStatistics(pokeDetails[1].gender_rate)

  return {
    height: pokeDetails[0].height,
    weight: pokeDetails[0].weight,
    gender_rate: chanchePokeGender,
    shape: pokeDetails[1].shape.name,
    color: pokeDetails[1].color.name,
    habitat: pokeDetails[1].habitat.name,
    generation: pokeDetails[1].generation.name
  }
}

pokeApi.getDetailsAbout = (pokeId) => {
  return Promise.all([
    fetchPokemon(`pokemon/${pokeId}/`),
    fetchPokemon(`pokemon-species/${pokeId}/`)
  ])
  .then(([pokemon, species]) => convertPokeApiDetailToAbout([pokemon, species]))
}