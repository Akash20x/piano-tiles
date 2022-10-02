let gameInstructions = document.querySelector('.game-instructions');
let instructionsButton = document.querySelector('.instruction-button');
let closeInstruction = document.querySelector('.close-instruction');

instructionsButton.addEventListener('click', function() {
    gameInstructions.classList.add('show');
})
closeInstruction.addEventListener('click', function() {
    gameInstructions.classList.remove('show');
})