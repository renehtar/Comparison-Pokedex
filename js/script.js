const buttonSubmit = document.querySelectorAll('.button__submit')
const forms = document.querySelectorAll('.form')
const list = document.querySelectorAll('.list')
const sumButtons = document.querySelectorAll('.sum__count__button')
const imgs = document.querySelectorAll('.pokemon__image')
const incomingPokemons = document.querySelectorAll('.input__search')
const lifePokemon = document.querySelectorAll('.life__pokemon')
const namePokemon = document.querySelectorAll('.name__pokemon')
const typePokemon = document.querySelectorAll('.type__pokemon')
const idPokemon = document.querySelectorAll('.id__pokemon')
const attackPokemon = document.querySelectorAll('.attack__pokemon')
const especialAttackPokemon = document.querySelectorAll('.especial__attack__pokemon')
const defesePokemon = document.querySelectorAll('.defese__pokemon')
const especialDefesePokemon = document.querySelectorAll('.especial__defese__pokemon')
const speedPokemon = document.querySelectorAll('.speed__pokemon')
const locationAreaPokemon = document.querySelectorAll('.where__to__find')
const seePokemon = document.querySelectorAll('.see__pokemon')
const alertModal = document.querySelector('.alert__modal')

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${String(pokemon).toLowerCase()}`)
  
  if(APIResponse.status === 200){
    const data = await APIResponse.json()
    return data
  }else{
    incomingPokemons.forEach(input => input.value = '')
    alertModal.classList.add('open__modal')
    setTimeout(()=>alertModal.classList.remove('open__modal'), 3000)
  }
}

const handleCardPokemon = {
  cardInfo: (index, data)=>{
    namePokemon[index].innerText = data.name
    idPokemon[index].innerText = `#${data.id}`
    imgs[index].src = data.sprites.versions['generation-v']['black-white'].animated.front_default
    lifePokemon[index].innerText = `vida: ${data.stats[0].base_stat}`
    attackPokemon[index].innerText = `ataque: ${data.stats[1].base_stat}`
    defesePokemon[index].innerText = `defesa: ${data.stats[2].base_stat}`
    especialAttackPokemon[index].innerText = `ataque especial: ${data.stats[3].base_stat}`
    especialDefesePokemon[index].innerText = `defesa especial: ${data.stats[4].base_stat}`
    speedPokemon[index].innerText = `velocidade: ${data.stats[5].base_stat}`
  },
  fromInput: async (e)=>{
    e.preventDefault()
    let index = +e.target.dataset.index
    let value = incomingPokemons[index].value
    incomingPokemons[index].value = ''
    const data = await fetchPokemon(value)
    const dataLocation = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.id}/encounters`)
    let location = await dataLocation.json()
 
    handleCardPokemon.cardInfo(index, data)
  
    typePokemon[index].querySelectorAll('.type').forEach(type => type.remove())
    for (let i = 0; i < data.types.length; i++) {
      const type = document.createElement("p");
      type.innerText = data.types[i].type.name;
      type.className = `type ${data.types[i].type.name}`;
      
      typePokemon[index].appendChild(type)
    }

    locationAreaPokemon[index].innerText = ''
    if(location.length > 0){
      for(let i = 0; i < location.length; i++){
        const locationArea = document.createElement('li')
        locationArea.innerText = `${location[i].location_area.name.replace(/-/g, ' ')} /`
        locationArea.className = 'location'
        locationAreaPokemon[index].appendChild(locationArea)
      }
    }else{
      locationAreaPokemon[index].innerText = 'somente evoluindo'
    }
  },
  fromList: async (e)=>{
    let index = +e.target.querySelector('.list__id__pokemon').innerText.replace('#','')
    const data = await fetchPokemon(index)
    const dataLocation = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}/encounters`)
    let location = await dataLocation.json()
    let id = e.target.dataset.id

    list[id].querySelectorAll('.container__pokemon').forEach(container => container.classList.remove('active'))
    e.target.classList.add('active')

    handleCardPokemon.cardInfo(id, data)

    typePokemon[id].querySelectorAll('.type').forEach(type => type.remove())

    for (let i = 0; i < data.types.length; i++) {
      const type = document.createElement("p");
      type.innerText = data.types[i].type.name;
      type.className = `type ${data.types[i].type.name}`;
      
      typePokemon[id].appendChild(type)
    }

    locationAreaPokemon[id].innerText = ''
    if(location.length > 0){
      for(let i = 0; i < location.length; i++){
        const locationArea = document.createElement('li')
        locationArea.innerText = `${location[i].location_area.name.replace(/-/g, ' ')} /`
        locationArea.className = 'location'
        locationAreaPokemon[id].appendChild(locationArea)
      }
    }else{
      locationAreaPokemon[id].innerText = 'somente evoluindo'
    }
  }
}

const handleListPokemon = async (countInit, countMap, position) => {
  countMap = +countInit + +countMap;
  for (let i = 1; countInit < countMap; i++) {
   countInit++;
   countLast = countMap;
   const data = await fetchPokemon(countInit);
   const liPokemon = document.createElement('li')
   
   liPokemon.className = 'container__pokemon'
   liPokemon.setAttribute('data-id',position)
   liPokemon.innerHTML =  `
   <img class="list__pokemon__image" src="${data.sprites.versions["generation-v"]["black-white"].animated.front_default}"/>
   <div class="desc">
   <p class="list__pokemon__name">${data.name}</p>
   <div class="container__type"></div>
   </div>
   <p class="list__id__pokemon">#${data.id}</p>
   `
   for (let i = 0; i < data.types.length; i++) {
     const typePokemon = document.createElement("p");
     
      typePokemon.innerText = data.types[i].type.name;
      typePokemon.className = `type ${data.types[i].type.name}`;
      
      liPokemon.querySelector('.container__type').appendChild(typePokemon)
    }
    
    liPokemon.addEventListener('click', handleCardPokemon.fromList)
    list[position].appendChild(liPokemon);
  }
 };
 
 const handleSum = ({ target }) => {
  const lastId = list[+target.dataset.index];
  const formatedId = lastId.lastChild.querySelector('.list__id__pokemon').innerText.replace("#", "");
  const countInit = formatedId;
  const countLast = +target.dataset.count;
  let startPosition = +target.dataset.id
  let lastPosition
  
  if(+target.dataset.index === 0){
    lastPosition = 2
  }else{
    lastPosition = 4
  }
  
  handleListPokemon(countInit, countLast, +target.dataset.index);

  for(let i = startPosition; i < lastPosition; i++){
    sumButtons[i].disabled = true;
    setTimeout(()=> sumButtons[i].disabled = false, `${countLast}99`)
  }
};

const seePokemonOnMobile = ({ target })=>{
  document.querySelectorAll('.card__pokemon')[target.dataset.index].classList.toggle('see__pokemon__active')
  target.innerText === 'mostrar pokémon' ? target.innerText = 'esconder pokémon' : target.innerText = 'mostrar pokémon'
}

 handleListPokemon(0,10,0)
 handleListPokemon(0,10,1)

forms.forEach(form => form.addEventListener('submit', handleCardPokemon.fromInput))
sumButtons.forEach(button => button.addEventListener('click', handleSum))
seePokemon.forEach(buttonSee => buttonSee.addEventListener('click', seePokemonOnMobile))