const game = document.querySelector('.game')
let isPaused = false;
let firstCard = null;
let matches = 0;

const loadCharacter = async () => {
    const APIUrl = "https://rickandmortyapi.com/api/character/";
    const randomIds = new Set();
    while (randomIds.size < 8) {
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }
    const characterPromises = [...randomIds].map(id => fetch(APIUrl + id));
    const responses = await Promise.all(characterPromises);
    return await Promise.all(responses.map(res => res.json()));
}

const showCharacter = (character) => {
    character.sort( _ => Math.random() - 0.5);
    const characterHTML = character.map(character => {
        return `
        <div class="card" onclick="clickCard(event)"
        data-charactername="${character.name}">
            <div class="front"></div>
            <div class="back rotated">
                <img src="${character.image}" alt=${character.name}/>
            </div>
        </div>
        `
    }).join('');
    game.innerHTML = characterHTML;
}

const clickCard = (event) => {
    const characterCard = event.currentTarget;
    const [front, back] = getFrontAndBackFromCard(characterCard);

    if(front.classList.contains("rotated") || isPaused) return;

    isPaused = true;

    rotateElements([front, back])
    if(!firstCard){
        firstCard = characterCard;
        isPaused = false;
    }
    else {
        const secondCharacterName = characterCard.dataset.charactername;
        const firstCharacterName = firstCard.dataset.charactername;
        if(firstCharacterName !== secondCharacterName){
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstCard)
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstCard = null;
                isPaused = false;
            }, 1000);
            
        }else{
            matches++;
            if(matches === 8){
                console.log("winner");
            }
            firstCard = null;
            isPaused = false;
        }
    }
}

const rotateElements = (elements) => {
    if(typeof elements !== 'object' || !elements.length) return;
    elements.forEach(element => element.classList.toggle('rotated'));
}

const getFrontAndBackFromCard = (card) =>{
    const front = card.querySelector(".front");
    const back = card.querySelector(".back")
    return [front, back]
}

const generateGame = () => {
    game.innerHTML = '';
    isPaused = true;
    firstCard = null;
    matches = 0;
    setTimeout(async () => {
        const character = await loadCharacter();
        showCharacter([...character, ...character]);
        isPaused = false;
    },300)
}

generateGame();