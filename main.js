const playImg = document.getElementById("img");
const playNumbers = document.getElementById("numbers");
playImg.addEventListener('click', playWidthImg);
playNumbers.addEventListener('click', playWidthNumbers);



function createImgCards() {
    for (let i = 1; i <= 16; i++) {
        let card = document.createElement('div');
        card.classList.add('pair-card');
        card.setAttribute("data-status", "unflip");
        document.querySelector('.pair-game').append(card);
    }
    const cards = document.querySelectorAll('.pair-card');
    cards.forEach(card => {
        let img = document.createElement('img');
        img.classList.add('back-face');
        img.setAttribute('src', 'img/js-badge.svg');
        img.setAttribute('alt', 'pair-card');
        card.append(img);
    });
    let frameworks = ['angular', 'aurelia', 'backbone', 'ember', 'jquery', 'node', 'react', 'vue'];
    let pictures = [];
    let k = 0;
    while (k < frameworks.length) {
        for (let i = 0; i < 2; i++) {
            let img = document.createElement('img');
            img.classList.add('front-face');
            img.setAttribute('src', 'img/' + frameworks[k] + '.svg');
            img.setAttribute('alt', frameworks[k]);
            pictures.push(img);
        }
        k++;
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].setAttribute('data-framework', pictures[i].getAttribute('alt'));
        cards[i].append(pictures[i]);
    }
}

function createNumberCards(size) {
    for (let i = 1; i <= size * size; i++) {
        let card = document.createElement('div');
        card.classList.add('pair-card');
        card.setAttribute("data-status", "unflip");
        card.setAttribute("style", "width: calc(" + 100 / size + "% - 10px); height: calc(" + 100 / size + "% - 10px);");
        document.querySelector('.pair-game').append(card);
    }
    const cards = document.querySelectorAll('.pair-card');
    let numbersArr = [];
    for (let i = 1; i <= cards.length / 2; i++) {
        numbersArr.push(i);
        numbersArr.push(i);
    }
    console.log(numbersArr);
    let k = 0;
    cards.forEach(card => {
        let span = document.createElement('div');
        span.classList.add('front-face');
        span.classList.add('number-style');
        span.textContent = numbersArr[k];
        span.setAttribute("style", "font-size: " + 400 / size + "px;");
        card.append(span);
        k++;
        let img = document.createElement('img');
        img.classList.add('back-face');
        img.setAttribute('src', 'img/js-badge.svg');
        img.setAttribute('alt', 'pair-card');
        card.append(img);
    });
}

let timer;

function createTimer(size) {
    let timerBlock = document.createElement('div');
    timerBlock.setAttribute("style", "position: absolute; top: 10%; right: 10%; color: white; font-size: 90px;");
    timerBlock.classList.add("timer");
    if (size * 30 % 60 < 10) {
        timerBlock.textContent = Math.floor((size * 30) / 60) + ":0" + (size * 30) % 60;
    } else {
        timerBlock.textContent = Math.floor((size * 30) / 60) + ":" + (size * 30) % 60;
    }
    document.body.append(timerBlock);
}

function playWidthNumbers() {
    let size = document.querySelector('input').value;
    if (!(size >= 2 && size <= 10 && size % 2 === 0)) {
        size = 4;
    }
    document.querySelector('.form').remove();
    createNumberCards(size);
    const cards = document.querySelectorAll('.pair-card');
    createTimer(size);
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        this.classList.add('flip');
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.textContent === secondCard.textContent;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.setAttribute("data-status", "flip");
        secondCard.setAttribute("data-status", "flip");
        if (checkGameStatus()) {
            createButton();
        }
        resetBoard();
    }

    function checkGameStatus() {
        let resetSum = 0;
        cards.forEach(card => {
            if (card.getAttribute("data-status") === "flip") {
                resetSum++;
            }
        });
        return resetSum === cards.length ? true : false;
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 800);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function createButton() {
        let button = document.createElement('button');
        button.classList.add('again');
        button.classList.add('pair-card');
        button.textContent = "Play again";
        button.setAttribute("onClick", "window.location.reload()");
        button.style.order = cards.length + 1;
        document.querySelector(".pair-game").append(button);
    }

    (function shuffle() {
        cards.forEach(card => {
            let randomInd = Math.floor(Math.random() * cards.length);
            card.style.order = randomInd;
        });
    })();
    let setTime = (size * 30) - 1;
    console.log(setTime);
    let timer = document.querySelector(".timer");
    let time = setInterval(() => {

        if (checkGameStatus()) {
            clearInterval(time);
            alert("YOU WON!!!");
            return;
        }

        if (setTime % 60 >= 10) {
            timer.textContent = Math.floor(setTime / 60) + ":" + Math.floor(setTime % 60);
            setTime--;
        } else {
            timer.textContent = Math.floor(setTime / 60) + ":0" + Math.floor(setTime % 60);
            setTime--;
        }

        if (setTime < 0) {
            clearInterval(time);
            alert("GAME OVER");
            cards.forEach(card => card.removeEventListener('click', flipCard));
            createButton();
        }
    }, 1000);
    cards.forEach(card => card.addEventListener('click', flipCard));
}





function playWidthImg() {
    document.querySelector('.form').remove();
    createImgCards();
    const cards = document.querySelectorAll('.pair-card');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    createTimer(4);

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        this.classList.add('flip');
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.setAttribute("data-status", "flip");
        secondCard.setAttribute("data-status", "flip");
        if (checkGameStatus()) {
            createButton();
        }
        resetBoard();
    }

    function checkGameStatus() {
        let resetSum = 0;
        cards.forEach(card => {
            if (card.getAttribute("data-status") === "flip") {
                resetSum++;
            }
        });
        return resetSum === cards.length ? true : false;
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 800);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    (function shuffle() {
        cards.forEach(card => {
            let randomInd = Math.floor(Math.random() * 16);
            card.style.order = randomInd;
        });
    })();

    function createButton() {
        let button = document.createElement('button');
        button.classList.add('again');
        button.classList.add('pair-card');
        button.textContent = "Play again";
        button.setAttribute("onClick", "window.location.reload()");
        button.style.order = cards.length + 1;
        document.querySelector(".pair-game").append(button);
    }
    let setTime = 59;
    let timer = document.querySelector(".timer");
    let time = setInterval(() => {
        if (checkGameStatus()) {
            clearInterval(time);
            alert("YOU WON!!!");
            return;
        }
        if (setTime >= 10) {
            timer.textContent = "0:" + setTime--;
        } else {
            timer.textContent = "0:0" + setTime--;
        }

        if (setTime < 0) {
            clearInterval(time);
            alert("GAME OVER");
            cards.forEach(card => card.removeEventListener('click', flipCard));
            createButton();
        }
    }, 1000);
    cards.forEach(card => card.addEventListener('click', flipCard));
}





