var isHost = 0;

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
    socket.emit("createGame", {playerName: name});
    return false;
}

socket.on("newGameCode", function(data) {
    console.log("Received game code " + data);
    document.getElementById("joinGameForm").style.display = "none";
    document.getElementById("createGameForm").style.display = "none";
    document.getElementById("createGameCode").style.display = "block";
    document.getElementById("gameCode").innerHTML = data;
});

function joinGame() {
    var name = document.getElementsByName("joinGameName")[0].value;
    var gameCode = document.getElementsByName("joinGameCode")[0].value;
    console.log("Joining game with name " + name + " and code " + gameCode);
    socket.emit("joinGame", {playerName: name, gameCode: gameCode});
    isHost = 1;
    return false;
}

socket.on("gameJoin", function(data) {
    if (data.game == null) {
        alert("We couldn't find a game with that code :(");
        return false;
    }
    start(isHost);
});

function showJoinCreateForm() {
    document.getElementById("joinGameForm").style.display = "none";
    document.getElementById("createGameForm").style.display = "none";
    document.getElementById("joinOrCreateForm").style.display = "block";
}

