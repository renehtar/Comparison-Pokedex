const alertModal = document.querySelector('.alert__modal')
const buttonSubmit = document.querySelectorAll('.button__submit')
const forms = document.querySelectorAll('.form')
const imgs = document.querySelectorAll('.pokemon__image')
const incomingPokemons = document.querySelectorAll('.input__search')
const namePokemon = document.querySelectorAll('.name__pokemon')
const typePokemon = document.querySelectorAll('.type__pokemon')
const idPokemon = document.querySelectorAll('.id__pokemon')
const lifePokemon = document.querySelectorAll('.life__pokemon')
const attackPokemon = document.querySelectorAll('.attack__pokemon')
const defesePokemon = document.querySelectorAll('.defese__pokemon')
const speedPokemon = document.querySelectorAll('.speed__pokemon')
const totalPokemon = document.querySelectorAll('.total__pokemon')
const rangeStats = document.querySelectorAll('.range__stats')

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
  
  if(APIResponse.status === 200){
    const data = await APIResponse.json()
    return data
  }else{
    incomingPokemons.forEach(input => input.value = '')
    alertModal.classList.add('open__modal')
    setTimeout(()=>alertModal.classList.remove('open__modal'), 3000)
  }
}

const calcPorcentage = (firstValue, secondValue)=>{
  let totalValue = firstValue + secondValue
  let porcentageValue = parseInt((100 * firstValue) / totalValue)
  return porcentageValue
}

const compareStatuses = ()=>{
  if(idPokemon[0].innerText.length > 1 && idPokemon[1].innerText.length > 1){
    let firstPokemonLife = Number(lifePokemon[0].innerText.replace('vida: ',''))
    let secondPokemonLife = Number(lifePokemon[1].innerText.replace('vida: ',''))
    
    let firstPokemonAttack = Number(attackPokemon[0].innerText.replace('ataque: ',''))
    let secondPokemonAttack = Number(attackPokemon[1].innerText.replace('ataque: ',''))

    let firstPokemonDefese = Number(defesePokemon[0].innerText.replace('defesa: ',''))
    let secondPokemonDefese = Number(defesePokemon[1].innerText.replace('defesa: ',''))
    
    let firstPokemonSpeed = Number(speedPokemon[0].innerText.replace('velocidade: ',''))
    let secondPokemonSpeed = Number(speedPokemon[1].innerText.replace('velocidade: ',''))

    let firstPokemonTotal = Number(totalPokemon[0].innerText.replace('total: ',''))
    let secondPokemonTotal = Number(totalPokemon[1].innerText.replace('total: ',''))

    rangeStats[0].style.background = `linear-gradient(90deg, #666 ${calcPorcentage(firstPokemonLife, secondPokemonLife)}%, #fff 0%)`
    rangeStats[1].style.background = `linear-gradient(90deg, #666 ${calcPorcentage(firstPokemonAttack, secondPokemonAttack)}%, #fff 0%)`
    rangeStats[2].style.background = `linear-gradient(90deg, #666 ${calcPorcentage(firstPokemonDefese, secondPokemonDefese)}%, #fff 0%)`
    rangeStats[3].style.background = `linear-gradient(90deg, #666 ${calcPorcentage(firstPokemonSpeed, secondPokemonSpeed)}%, #fff 0%)`
    rangeStats[4].style.background = `linear-gradient(90deg, #666 ${calcPorcentage(firstPokemonTotal, secondPokemonTotal)}%, #fff 0%)`
  }
}

const handleForm = async (event)=>{
  event.preventDefault()
  const index = event.target.dataset.index
  const data = await fetchPokemon(incomingPokemons[index].value)
  let totalPoints = data.stats[0].base_stat + data.stats[1].base_stat + data.stats[2].base_stat + data.stats[5].base_stat
  
  incomingPokemons[index].value = ''
  namePokemon[index].innerText = data.name
  idPokemon[index].innerText = `#${data.id}`
  typePokemon[index].innerText = data.types[0].type.name
  imgs[index].src = data.sprites.versions['generation-v']['black-white'].animated.front_default
  lifePokemon[index].innerText = `vida: ${data.stats[0].base_stat}`
  attackPokemon[index].innerText = `ataque: ${data.stats[1].base_stat}`
  defesePokemon[index].innerText = `defesa: ${data.stats[2].base_stat}`
  speedPokemon[index].innerText = `velocidade: ${data.stats[5].base_stat}`
  totalPokemon[index].innerText = `total: ${totalPoints}`
  compareStatuses()
}

forms.forEach(form => form.addEventListener('submit', handleForm))