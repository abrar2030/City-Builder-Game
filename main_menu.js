let newGame = document.querySelector("button#NewGame");
let body = document.querySelector("body");
let loadGame = document.querySelector("button#LoadGame");
let exitGame = document.querySelector("button#Exit");


function handleNewGameButton(){
    window.location.href = "game.php";
}

newGame.addEventListener("click", handleNewGameButton);

function handleExitGame(){
    if (confirm("Are you sure you want to close this tab?")) {
        window.close(); // This will close the current tab/window
    }
}

function handleLoad(){
    window.location.href = "load_game.php";
}

loadGame.addEventListener("click",handleLoad);
exitGame.addEventListener("click",handleExitGame);

