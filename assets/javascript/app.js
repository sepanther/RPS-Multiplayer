$(document).ready( function() {

//Initialize Firebase

//Initialize variables
var playerCounter=0

//Function to load the game
function loadGame() {
    var startBtn = $("<button>");
    console.log(startBtn)
    startBtn.addClass("btn btn-info start-button");
    startBtn.text("Start")
    $("#content").append(startBtn)
}

//Function to determine if two players are ready
function isReady() {
    if (playerCounter === 2) {
        chooseAttack();
    }
}

//Function to choose your attack
function chooseAttack() {
    $("#content").empty();
    $("#content").text("Choose your attack!")

}


//When user clicks "Start"
$(document.body).on("click", ".start-button", function() {
    playerCounter++
    if (playerCounter < 2) {
        $("#content").empty();
        $("#content").text("Waiting for player 2...")
        setInterval(isReady, 1000)
    }
    if (playerCounter === 2) {
        chooseAttack();
    }
})


loadGame();


})