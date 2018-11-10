$(document).ready( function() {

//Initialize Firebase
var config = {
    apiKey: "AIzaSyD-tXUq6uTV0uSUqIF-wj0PrJqQlS1XKys",
    authDomain: "rock-paper-scissors-dfa79.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-dfa79.firebaseio.com",
    projectId: "rock-paper-scissors-dfa79",
    storageBucket: "rock-paper-scissors-dfa79.appspot.com",
    messagingSenderId: "1082673602145"
  };
  firebase.initializeApp(config);

//Initialize variables
var database = firebase.database();
var players = database.ref("/players");
var connectedRef = database.ref(".info/connected");
var con;
var playerCount = 0;
var choices = ["Rock", "Paper", "Scissors"]
var playerObj;
var playerID;
var attack = "attack";
var oppAttack;
var oppPlayerID;
var wins=0;
var oppWins=0;



//Function to load the game
function loadGame() {
    var startBtn = $("<button>");
    console.log(startBtn)
    startBtn.addClass("btn btn-info start-button");
    startBtn.text("Start");
    var name= $("<input>");
    $(name).attr('id', 'name-input');
    $("#content").append(name);
    $("#content").append(startBtn);
}

//Function to choose your attack
function chooseAttack() {
    database.ref().child(playerID).set({
        name:name,
        attack:"attack",
        wins:wins
    })
    $("#content").empty();
    $("#content").html("Choose your attack!<br>")
    for (i=0; i<choices.length; i++) {
        var button = $("<button>")
        button.val(choices[i]);
        button.text(choices[i]);
        button.addClass("btn btn-info attack")
        $("#content").append(button);
    };
    
}

//On choosing of attack, send data to Firebase and update screen
$(document.body).on("click", ".attack", function() {
    attack = $(this).val();
    database.ref().child(playerID).set({
        name:name,
        attack:attack
    })
})

//When user clicks "Start"
$(document.body).on("click", ".start-button", function() {
    // playerCounter++
    // if (playerCounter < 2) {
        var con = players.push(true);
        con.onDisconnect().remove();
        addPlayer();

})

//Add player object
function addPlayer() {
    name = $("#name-input").val();
    playerID = "Player" + playerCount
    if (playerID === "Player1") {
        oppPlayerID = "Player2"
    }
    else {
        oppPlayerID = "Player1"
    }
    database.ref().child(playerID).set({
        name:name,
        attack:attack
    })
    if (playerCount < 2) {
        waitingRoom();
    }
    else {
        chooseAttack();
    }
}

//When player count is 2, move on to gameplay
database.ref().on("value", function(snap) {
    
    try{
        oppAttack = snap.val()[oppPlayerID].attack;
    }catch(e){
        console.log("no attack yet")
    }
    if (snap.val()[oppPlayerID].attack !== "attack" && snap.val()[playerID].attack !== "attack") {
        console.log("evaluate game");
        console.log("my attack: " + attack)
        console.log("opponent attack: " + oppAttack)
        console.log(attack==oppAttack);
        evaluateGame();
    }
    else if (snap.val()[oppPlayerID].attack === "attack" && snap.val()[playerID].attack !== "attack") {
        console.log("waiting for opponent to choose attack")
    }
    else if (playerCount === 2) {
        chooseAttack();
    }
})

//Funtion to evalulate game
function evaluateGame() {
    console.log("evaluating...")
    $("#content").empty();
    if (attack==oppAttack) {
        console.log("in if statement")
        $("#content").html("It was a tie! Choose again.")
        setTimeout(chooseAttack, 3000)
    }
    else if (attack=="Rock" && oppAttack=="Paper") {
        $("#content").html("Opponent wins! You suck")
    }
    else if (attack=="Rock" && oppAttack=="Scissors") {
        $("#content").html("You won!")
        wins++
        console.log("wins: " + wins);
    }
    else if (attack=="Paper" && oppAttack=="Scissors") {
        $("#content").html("Opponent wins! You suck")
    }
    else if (attack=="Paper" && oppAttack=="Rock") {
        $("#content").html("You won!")
        wins++
        console.log("wins: " + wins);
    }
    else if (attack=="Scissors" && oppAttack=="Rock") {
        $("#content").html("Opponent wins! You suck")
    }
    else if (attack=="Scissors" && oppAttack=="Paper") {
        $("#content").html("You won!")
        wins++
        console.log("wins: " + wins);
    }
    setTimeout(chooseAttack, 3000)


}

//If the player has to wait for another player
function waitingRoom() {
    $("#content").empty();
    $("#content").text("Waiting for an opponent");
}


loadGame();

//Every time something changes, check how many players there are
database.ref().on("value", function(snap) {
    try{
        playerObj = snap.val().players
    }catch(e){
        console.log("No players")
    }
    if (playerObj !== undefined) {
        playerCount = Object.keys(playerObj).length
    }
    console.log("players: " + playerCount)
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  })

})