//On document ready

$(document).ready(function () {

    // Variables

    var survivor;
    var zombieEasy;
    var zombieMedium;
    var zombieHard;

    var characterSelection = [];
    var character = null;
    var defenders = [];
    var defender = null;

    //Start game function, list characters and stats
    function startGame() {
        survivor = {
            id: 0,
            name: "Brad Pitt",
            healthPoints: 120,
            baseAttack: 10,
            attackPower: 10,
            counterAttackPower: 8,
            img: "./assets/images/survivor.jpg"
        };

        zombieEasy = {
            id: 1,
            name: "Slow Zombie",
            healthPoints: 120,
            baseAttack: 10,
            attackPower: 8,
            counterAttackPower: 5,
            img: "./assets/images/zombieEasy.jpeg"
        };

        zombieMedium = {
            id: 2,
            name: "Strong Zombie",
            healthPoints: 150,
            baseAttack: 12,
            attackPower: 10,
            counterAttackPower: 10,
            img: "./assets/images/zombieMedium.jpeg"
        };

        zombieHard = {
            id: 3,
            name: "Brute Zombie",
            healthPoints: 170,
            baseAttack: 14,
            attackPower: 12,
            counterAttackPower: 15,
            img: "./assets/images/zombieHard.jpeg"
        };
        // reset character selected
        character = null;

        // reset enemies array
        defenders = [];

        // reset enemy selected
        defender = null;

        // reset character selections
        characterSelection = [survivor, zombieEasy, zombieMedium, zombieHard];

        // clears all character divs
        $("#character").empty();
        $("#defenderArea").empty();
        $("#defender").empty();
        $("#status").empty();
        //For each characterSelection, take the index, create a new div for that character and give it the set classes
        $.each(characterSelection, function (index, character) {
            // create a div for each character to display character selection at start of the game
            var newCharacterDiv = $("<div>").addClass("character panel panel-success").attr("id", character.id);
            //Creating the divs, add the class (In CSS), change the html, append the image and healthpoints
            $("<div>").addClass("panel-heading").html(character.name).appendTo(newCharacterDiv);
            $("<div>").addClass("panel-body").append("<img src='" + character.img + "'>").appendTo(newCharacterDiv);
            $("<div>").addClass("panel-footer").append("<span class='hp'>" + character.healthPoints + "</span>").appendTo(newCharacterDiv);

            // append new div to character selection
            $("#characterSelection").append(newCharacterDiv);
        });
        //On click of character ID
        $(".character").on("click", function () {
            // when character has been selected
            if (character === null) {
                console.log("picked character");
                //get id of character selected
                var charId = parseInt($(this).attr("id"));

                character = characterSelection[charId];

                // loop through character array
                $.each(characterSelection, function (index, character) {
                    // add unselected characters to enemies array
                    if (character.id !== charId) {
                        defenders.push(character);
                        //Remove character from panel and append to character div
                        $("#" + character.id).removeClass("character panel-success").addClass("defender panel-danger").appendTo("#defenderArea");
                    } else {
                        $("#" + character.id).appendTo("#character");
                    }
                });

                // add click event after defender class has been added
                $(".defender").on("click", function () {
                    if (defender === null) {
                        //Get defender ID 
                        var defenderId = parseInt($(this).attr("id"));
                        console.log(this);
                        defender = characterSelection[defenderId];
                        $("#" + defenderId).appendTo("#defender");
                    }
                });
            }
        });
        //Hide restart button
        $("#restart").hide();
    }
        //Run restart function
    startGame();


    //On Click event for attack button
    $("#attack").on("click", function () {
        // when character has been selected, character has not been defeated and there are still defenders left
        if (character !== null && character.healthPoints > 0 && defenders.length > 0) {
            // created variable to store game status messages
            var status = "";

            // when defender has been selected
            if (defender !== null) {
                // decrease defender HP by character attack power
                defender.healthPoints -= character.attackPower;
                //Add to status attack text, for attackPower
                status += "You attacked " + defender.name + " for " + character.attackPower + " damage.<br>";

                console.log("Defender: ", defender.name, defender.healthPoints);

                // update defender HP (ASK WHY THIS IS WRITTEN THIS WAY)
                $("#" + defender.id + " .hp").html(defender.healthPoints); 

                // decrease character HP by defender counter attack power
                character.healthPoints -= defender.counterAttackPower;
                //Set status to defender name, text, and counterAttackPower
                status += defender.name + " attacked you back for " + defender.counterAttackPower + " damage.<br>";

                console.log("Character: ", character.name, character.healthPoints);

                // update character HP
                $("#" + character.id + " .hp").html(character.healthPoints);

                // increase character attack power by base attack power
                character.attackPower += character.baseAttack;

                // when character is defeated
                if (character.healthPoints <= 0) {
                    status = "You didn't survive... Do you wish to play again?";
                    $("#restart").show();
                } else if (defender.healthPoints <= 0) { // when defender is defeated
                    status = "You have defeated " + defender.name + ", pick another zombie to fight!";

                    // clear defender selection
                    $("#defender").empty();
                    defender = null;

                    // remove defeated defender from defender array
                    defenders.splice(defenders.indexOf(defender), 1);
                }

                // when no defenders left in array
                if (defenders.length === 0) {
                    status = "You win!";
                    $("#restart").show();
                }
                //If there are enemies left in array, update status
            } else {
                status = "No enemy here.";
            }

            $("#status").html(status);
        }
    });

    $("#restart").on("click", function () {
        startGame();
    });

});