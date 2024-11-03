/**
 * 
 * 
 * 
 * OK Générer la combinaison secrète (4 couleurs)
 *    Pouvoir proposer une combinaison
 *    Gérer début et fin de partie
 * 
 * 
 * Ajouter d'autres éléments si on a le temps
 */
import { Utils } from "../lib/Utils/utils.js";
import { Confetti } from "../lib/confetti.js";

const colors = ["red", "blue", "yellow", "pink"];
const allSelectDiv = document.getElementById("allSelect");
let colorTabToFind = null;
const nbColorToFind = 4;

document.getElementById("startButton").addEventListener("click", () => {
    launchGame();
});

function launchGame() {
    setAleaColorTab();
    // Afficher le tableau à trouver en console.
    console.log(colorTabToFind);
    allSelectDiv.innerHTML = ""; // Clear previous content safely
    generateLineSelect();
}

function checkProposition() {
    let allSelect = allSelectDiv.querySelectorAll("select");
    let propal = Array.from(allSelect, select => select.value).slice(0 - nbColorToFind);

    let cptGoodPlace = 0;
    let cptBadPlace = 0;
    let colorToFindCopy = [...colorTabToFind]; // Copy of the color array to modify during checks

    // Check for correct positions
    for (let i = 0; i < propal.length; i++) {
        if (propal[i] === colorToFindCopy[i]) {
            cptGoodPlace++;
            colorToFindCopy[i] = "found";
            propal[i] = "foundInPropal";
        }
    }

    // Check for correct colors in wrong positions
    for (let i = 0; i < propal.length; i++) {
        if (propal[i] !== "foundInPropal") {
            let found = false;
            colorToFindCopy.forEach((color, index) => {
                if (!found && propal[i] === color) {
                    cptBadPlace++;
                    propal[i] = "foundInPropal";
                    colorToFindCopy[index] = "found";
                    found = true;
                }
            });
        }
    }

    // Add the feedback message
    let lineResponse = document.createElement("div");
    lineResponse.textContent = `Bon endroit : ${cptGoodPlace} | Mauvais endroit : ${cptBadPlace}`;
    allSelectDiv.appendChild(lineResponse);

    // Check for win condition
    if (cptGoodPlace === colorTabToFind.length) {
        Confetti.launchAnimationConfeti();
        setTimeout(() => {
            Confetti.stopAnimationConfeti();
        }, 5000);
    } else {
        generateLineSelect(); // Generate a new line of selects if the game continues
    }
}

function generateLineSelect() {
    let line = document.createElement("div");
    for (let index = 0; index < nbColorToFind; index++) {
        generateSelect(line);
    }
    let btn = document.createElement("button");
    btn.textContent = "OK";
    line.appendChild(btn);
    btn.addEventListener("click", () => {
        checkProposition();
    });
    allSelectDiv.appendChild(line);
}

function generateSelect(target) {
    let mySelect = document.createElement("select");
    colors.forEach(color => {
        let colorOption = document.createElement("option");
        colorOption.value = color;
        colorOption.style.backgroundColor = color;
        colorOption.textContent = color; // Display color name in the select
        mySelect.appendChild(colorOption);
    });
    mySelect.style.backgroundColor = mySelect.value;

    mySelect.addEventListener("change", (e) => {
        e.target.style.backgroundColor = e.target.value;
    });
    target.appendChild(mySelect);
}

function setAleaColorTab(size = nbColorToFind) {
    colorTabToFind = [];
    for (let index = 0; index < size; index++) {
        colorTabToFind.push(getAleaColor());
    }
}

function getAleaColor() {
    let aleaIndex = Utils.getRandomInt(colors.length);
    return colors[aleaIndex];
}

// Variables pour gérer les tentatives
const maxAttempts = 10; // Nombre maximum de tentatives
let attemptsRemaining = maxAttempts;

// Sélection de l'élément de la barre de progression
const progressBar = document.querySelector('.progress');

// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
    // Calcul de la largeur en pourcentage basée sur les tentatives restantes
    const progressPercentage = (attemptsRemaining / maxAttempts) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Appeler cette fonction à chaque tentative échouée
function handleFailedAttempt() {
    if (attemptsRemaining > 0) {
        attemptsRemaining--;
        updateProgressBar(); // Met à jour la barre de progression
    }

    // Vérifie si le joueur a épuisé ses tentatives
    if (attemptsRemaining === 0) {
        alert("Vous avez perdu ! Plus de tentatives restantes.");
        // Ici, vous pouvez réinitialiser le jeu ou afficher un message de fin
    }
}

