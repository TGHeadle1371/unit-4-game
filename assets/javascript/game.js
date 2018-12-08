// Global variables

var player; //player object
var defender; //defender object
var charArray = []; //Holds game characters
var playerSelected = false; //Boolean to activate the character
var defenderSelected = false; //Activate defender
var baseAttack = 0; //Sets base attack to 0


//Character properties

function Character(name, hp, ap, counter, pic) {
    this.name = name;
    this.healthPoints = hp;
    this.attackPower = ap;
    this.counterAttackPower = counter;
    this.pic = pic;
}


//Attack Power Multiplier
Character.prototype.attack = function () {
    this.attackPower += baseAttack;
};

//Perform Attack

Character.prototype.attack = function (Obj) {
    Obj.healthPoints -= this.attackPower;
    $("#msg").html("You attacked " +
        Obj.name + "for " + this.attackPower + " damage points.");
    this.attack();
};

//Perform Counter Attack

Character.prototype.counterAttack = function (Obj) {
    Obj.healthPoints -= this.counterAttackPower;
    $("#msg").append("<br>" + this.name + " counter attacked you for " + this.counterAttackPower + " damage points.");
};

//Initialize Characters

function initCharacters() {
    var survivor = new Character("Survivor", 120, 15, 1, "./assets/images/survivor.jpg");
    var zombieEasy = new Character("Slow Zombie", 150, 30, 10, "./assets/images/zombieEasy.jpeg");
    var zombieMedium = new Character("Aggressive Zombie", 170, 40, 20, "./assets/images/zombieMedium.jpeg");
    var zombieHard = new Character("BIG SCARY ZOMBIE", 190, 50, 30, "./assets/images/zombieHard.jpeg");
    charArray.push(survivor, zombieEasy, zombieMedium, zombieHard);
}


//Save attack value
function setBaseAttack(Obj) {
    baseAttack = Obj.attackPower;
}

//Check HP
function isAlive(Obj) {
    if (Obj.healthPoints > 0) {
        return true;
    }
    return false;
}


//Check if WIN
function isWinner() {
    if (charArray.length == 0 && player.healthPoints > 0)
        return true;
    else return false;
}

// Create the character cards onscreen
function characterCards(divID) {
    $(divID).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(divID).append("<div />");
        $(divID + " div:last-child").addClass("card");
        $(divID + " div:last-child").append("<img />");
        $(divID + " img:last-child").attr("id", charArray[i].name);
        $(divID + " img:last-child").attr("class", "card-img-top");
        $(divID + " img:last-child").attr("src", charArray[i].pic);
        $(divID + " img:last-child").attr("width", 150);
        $(divID + " img:last-child").addClass("img-thumbnail");
        $(divID + " div:last-child").append(charArray[i].name + "<br>");
        $(divID + " div:last-child").append("HP: " + charArray[i].healthPoints);
        $(divID + " idv:last-child").append();

    }
}

// Move img to DIV
function movePics(fromDivID, toDivID) {
$(fromDivID).children().remove();
for (var i = 0; i < charArray.length; i++) {
    $(toDivID).append("<img />");
    $(toDivID + " img:last-child").attr("id", charArray[i].name);
    $(toDivID + " img:last-child").attr("src", charArray[i].pic);
    $(toDivID + " img:last-child").attr("width", 150);
    $(toDivID + " img:last-child").addClass("img-thumbnail");
}
}

//Document On Click Event

$(document).on("click", "img", function () {
    //Chooses defender and removes it from charArray
    if (playerSelected && !defenderSelected && (this.id != player.name)) {
        for (var i = 0; i < charArray.length; i++) {
            if (charArray[i].name === (this).id) {
                defender = charArray[i]; //Picks defender
                charArray.splice(i, 1); //Splits it from the array
                defenderSelected = true; //Adds it to the defenderSelected variable
                $("#msg").html("Click to Attack!");
            }
        }
        $("#defenderDiv").append(this); // appends the selected defender to the div 
        $("#defenderDiv").append("<br>" + defender.name);
        $("#defenderHealthDiv").append("HP: " + defender.healthPoints);
    }

    //Stores User Character in playerSelected and removes from charArray
    if (!playerSelected) {
        for (var j = 0; j < charArray.length; j++) {
            if (charArray[j].name === (this).id) {
                player = charArray[j]; //Sets player
                //Could add audio
                setBaseAttack(player);
                charArray.splice(j, 1);
                playerSelected = true;
                movePics();
                $("#msg").html("Pick a Zombie to crush!");
            }
        }
        movePics("#game", "#defendersLeftDiv");
        $("#playerDiv").append(this); // appends the selected player to the div
        $("#playerDiv").append(player.name);
        $("#playerHealthDiv").append("HP: " + player.healthPoints);
    }
});

// ATTACK BUTTON

$(document).on("click", "#attackBtn", function () {
    if (playerSelected && defenderSelected) { // Given both player and defender are selected
        if (isAlive(player) && isAlive(defender)) { //And if both are alive
            player.attack(defender); //Player attacks defender
            defender.counterAttack(player); //defender counterAttack
            $("#playerHealthDiv").html("HP: " + player.healthPoints); //Display health points
            $("#defenderHealthDiv").html("HP: " + defender.healthPoints);
            if (!isAlive(defender)) { //If the defender dies, display DEFEAT, next
                $("#defenderHealthDiv").html("DEFETED!");
                $("#playerHealthDiv").html("Enemy defeated!");
                $("#msg").html("Pick another enemy to battle...");
            }
            if (!isAlive(player)) { // If player dies, display LOST, RESTART IF ATTACK CLICK
                $("#playerHealthDiv").html("YOU LOST!");
                $("#msg").html("Try again...");
                $("#attackBtn").html("Restart Game");
                $(document).on("click", "#attackBtn", function () { // restarts game
                    location.reload(); //RELOAD
                });
            }
        }
        if (!isAlive(defender)) { //If defender is not alive, 
            $("#defenderDiv").children().remove();
            $("#defenderDiv").html("");
            $("#defenderHealthDiv").html("");
            defenderSelected = false;
            if (isWinner()) {
                $("#globalMsg").show();
            }
        }
    }
});
// EXECUTE
$(document).ready(function () {
    $("#globalMsg").hide();
    initCharacters();
    characterCards("#game");
});