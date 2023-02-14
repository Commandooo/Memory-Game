const game = document.querySelector('.game')
const movesCount = document.querySelector('.moves')
const timerCount = document.querySelector('.timer')
let isPaused = false;
let firstCard = null;
let matches = 0;
let moves = 0;
let seconds = 0;
let minutes = 0;
let interval;
let minutesValue;
let secondsValue;

const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timerCount.textContent = `${minutesValue}:${secondsValue}`;
}
 
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
            moves++;
            movesCount.textContent = `${moves}`;
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstCard)
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstCard = null;
                isPaused = false;
            }, 1000);
            
        }else{
            moves++;
            movesCount.textContent = `${moves}`;
            matches++;
            if(matches === 8){
                clearInterval(interval);
                alert(`You won in ${moves} moves and in ${minutesValue}:${secondsValue}!`);
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
    moves = 0;
    movesCount.textContent = "";
    seconds = 0;
    minutes = 0;
    timerCount.textContent = "";
    interval = setInterval(timeGenerator, 1000);
    setTimeout(async () => {
        const character = await loadCharacter();
        showCharacter([...character, ...character]);
        isPaused = false;
    },300)
}

generateGame();