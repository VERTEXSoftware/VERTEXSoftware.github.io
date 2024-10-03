const gameBoard = document.getElementById('game-board');

function updateNumResult(counts){
    document.getElementsByClassName('result-text')[0].textContent = "НАЙДЕНО КАРТ "+ counts;
}

function PlayOneShot(path){
    let aud = new Audio(path);
    aud.play();
}

const  cardslive= [
    'res/cat.png',
    'res/bee.png',
    'res/boulder.png',
    'res/bullfrog.png',
    'res/rabbit.png',
    'res/warren.png',
    'res/stoat.png', 
    'res/squirrel.png'
];

const cardsdead = [
    'res/cat_dead.png',
    'res/bee_dead.png',
    'res/boulder_dead.png',
    'res/bullfrog_dead.png',
    'res/rabbit_dead.png',
    'res/warren_dead.png',
    'res/stoat_dead.png', 
    'res/squirrel_dead.png'
];

const cardsArray = [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];

let firstCard=null;
let secondCard=null;
let hasFlippedCard = false;
let lockBoard = false;
let countDead=0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; --i) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetGame() {
   
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flipped');
        
        let cardFront = card.querySelector('.card-front') || card.querySelector('.card-dead');
        
        if (cardFront.classList.contains('card-dead')) {
            cardFront.classList.remove('card-dead');
            cardFront.classList.add('card-front');
            
        }
        card.querySelector('.card-back').style.backgroundImage = `url('res/back.png')`;
        
    });
    PlayOneShot('sound/card_flip_up.wav');
    PlayOneShot('sound/restart.wav');
    setTimeout(() => {
        while (gameBoard.firstChild) {
            gameBoard.removeChild(gameBoard.firstChild);
        }

        countDead=0;
        hasFlippedCard = false;
        firstCard = null;
        secondCard = null;
        createBoard();
    }, 1000);
    
}

function createBoard() {
    updateNumResult(countDead);
    let shuffledCards = shuffle(cardsArray);
    shuffledCards.forEach(index =>{
        let card = document.createElement('div');
        card.classList.add('card');
        
        let cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        let cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.setAttribute('idx', index);

        let cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.setAttribute('idx', index);
        cardBack.style.backgroundImage = `url('${cardslive[index]}')`;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    PlayOneShot('sound/card_flip_up.wav');
    if (lockBoard){return;}
    if (this === firstCard){return;}

    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = (firstCard.querySelector('.card-back').style.backgroundImage === secondCard.querySelector('.card-back').style.backgroundImage);
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        let firstCardFront = firstCard.querySelector('.card-front');
        let secondCardFront = secondCard.querySelector('.card-front');

        firstCardFront.classList.remove('card-front');
        firstCardFront.classList.add('card-dead');

        secondCardFront.classList.remove('card-front');
        secondCardFront.classList.add('card-dead');

        let idxf = firstCardFront.getAttribute('idx');
        let idxs = secondCardFront.getAttribute('idx');


        firstCard.querySelector('.card-dead').style.backgroundImage = `url('${cardsdead[idxf]}')`;
        secondCard.querySelector('.card-dead').style.backgroundImage = `url('${cardsdead[idxs]}')`;

        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        countDead++;
        updateNumResult(countDead);
        PlayOneShot('sound/card_dead03.wav');
        resetBoard();
    }, 500);
    
   
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        PlayOneShot('sound/card_flip_back.wav');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

    if(countDead>=8){
        setTimeout(() => {
        resetGame();
        }, 1000);
    }
}

createBoard();

