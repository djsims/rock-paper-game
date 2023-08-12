elements = {
    highScore: getElement('highScoreId'),
    player: getElements(['rock', 'paper', 'scissors'], 'player'),
    feedback: getElements(['pickText','resultText','scoreText','score','playAgain']),
    opponent: getElements(['waiting', 'rock', 'paper', 'scissors'], 'opponent')
}

let playerScore = 0;
let highScore = parseInt(localStorage.getItem('highScorePick')) || 0;
let opponentScore = 0;
let canPick = true;
const possibleOptions = ['rock', 'paper', 'scissors'];

pick()

function checkPick(playerPick) {
    if (!canPick) {
        return;
    }

    const opponentPick = getOpponentPick();
    const finalResult = checkFinalResult(playerPick, opponentPick);

    updateScore(finalResult);
    result(playerPick, opponentPick);

    canPick = false;
}

function getOpponentPick() {
    const randomIndex = Math.floor(Math.random() * possibleOptions.length)
    return possibleOptions[randomIndex];
}

function checkFinalResult(playerPick, opponentPick) {
    if (playerPick === opponentPick) {
        return 'tie';
    }

    return ((playerPick === 'rock' && opponentPick === 'scissors') ||
        (playerPick === 'paper' && opponentPick === 'rock') ||
        (playerPick === 'scissors' && opponentPick === 'paper')
    ) ? 'win' : 'lose';
}

function updateScore(finalResult) {

    if (finalResult === 'tie') {
        updateTextUI(elements.feedback.resultText, "It's a tie");
    } else {
        finalResult === 'win' ? playerScore++ : opponentScore++;
        updateTextUI(elements.feedback.resultText, `You ${finalResult}!`);
        checkHighScore();
    }
}

function checkHighScore() {
    if (playerScore > highScore) {
        highScore = playerScore;
        localStorage.setItem('highScorePick', highScore);
        updateHighScoreUI();
    }
}

function updateHighScoreUI() {
    updateTextUI(elements.highScore, highScore);
}

function pick() {
    clear();
    updateHighScoreUI();

    const hiddenElements = [
        elements.feedback.resultText,
        elements.feedback.scoreText,
        elements.feedback.playAgain,
        elements.opponent.rock,
        elements.opponent.paper,
        elements.opponent.scissors
    ]

    toggleElements(hiddenElements, 'hide');
}

function result(playerPick, opponentPick) {

    Object.entries(elements.player).map(([key, tagId]) => {
        toggleElement(tagId, key === playerPick ? 'show' : 'hide');
    })

    const hiddenElements = [
        elements.feedback.pickText,
        elements.opponent.waiting
    ]

    const shownElements = [
        elements.feedback.resultText,
        elements.feedback.scoreText,
        elements.feedback.playAgain,
        elements.opponent[opponentPick]
    ]

    toggleElements(hiddenElements, 'hide');
    toggleElements(shownElements, 'show');

    updateTextUI(elements.feedback.score, `${playerScore} - ${opponentScore}`);
}

function playAgain() {
    clear();
    pick();
    canPick = true;
}

function toggleElements(elements, action) {
    elements.forEach(element => toggleElement(element, action))
}

function toggleElement(element, action) {
    if (action === 'show') {
        element.classList.remove('hide');
    } else if (action === 'hide') {
        element.classList.add('hide');
    }
}

function updateTextUI(element, text) {
    element.textContent = text;
}

function getElement(id) {
    return document.getElementById(id);
}

function getElements(ids, prefix = '') {

    return  ids.reduce((accumulator, it) => {
        const id = prefix ? `${prefix}${capitalize(it)}Id` : `${it}Id`;
        accumulator[it] = getElement(id);
        return accumulator;
    }, {});
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function clear() {

    Object.values(elements).forEach(elementCategory => {
        if (typeof elementCategory === 'object') {
            Object.values(elementCategory)
                .forEach(element => toggleElement(element, 'show'))
        }
    })
}
