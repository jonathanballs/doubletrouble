function showNewGameForm() {
    document.getElementById("joinOrCreateForm").style.display = "none";
    document.getElementById("createGameForm").style.display = "block";
}

function showJoinGameForm() {
    document.getElementById("joinOrCreateForm").style.display = "none";
    document.getElementById("joinGameForm").style.display = "block";
}

function createNewGame() {
    var name = document.getElementsByName("createGameName")[0].value;
    console.log("Creating new game with name " + name);
}

function joinGame() {
    var name = document.getElementsByName("joinGameName")[0].value;
    var gameCode = document.getElementsByName("joinGameCode")[0].value;
    console.log("Creating new game with name " + name + " and code " + gameCode);
}

function showJoinCreateForm() {
    document.getElementById("joinGameForm").style.display = "none";
    document.getElementById("createGameForm").style.display = "none";
    document.getElementById("joinOrCreateForm").style.display = "block";
}

