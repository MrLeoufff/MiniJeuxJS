import { Utils } from "../lib/Utils/utils.js";
import { Confetti } from "../lib/confetti.js";

const colors = ["red", "blue", "yellow", "pink"];
const allSelectDiv = document.getElementById("allSelect");
let colorTabToFind = null;
const nbColorToFind = 4;
const maxAttempts = 10;
let attemptsRemaining = maxAttempts;
let gameOver = false;
const messageBox = document.getElementById("messageBox");

const progressBar = document.querySelector('.progress');

// Initialise la partie en attachant l'événement au bouton de démarrage
document.getElementById("startButton").addEventListener("click", () => {
    launchGame();
    updateProgressBar();
});

// Fonction principale pour lancer une nouvelle partie
function launchGame() {
    setAleaColorTab();
    console.log("Combinaison à trouver : ", colorTabToFind);
    allSelectDiv.innerHTML = "";
    attemptsRemaining = maxAttempts;
    gameOver = false;
    updateProgressBar();
    generateLineSelect();
    document.getElementById("startButton").disabled = true;
    showMessage("Le jeu commence ! Préparez-vous, les neurones !");
}

// Vérifie la proposition actuelle par rapport à la combinaison secrète
function checkProposition() {
    if (gameOver) return;

    let allSelect = allSelectDiv.querySelectorAll("select");
    let propal = Array.from(allSelect, select => select.value).slice(0 - nbColorToFind);

    let cptGoodPlace = 0;
    let cptBadPlace = 0;
    let colorToFindCopy = [...colorTabToFind];

    // Vérifie les bonnes positions
    for (let i = 0; i < propal.length; i++) {
        if (propal[i] === colorToFindCopy[i]) {
            cptGoodPlace++;
            colorToFindCopy[i] = "found";
            propal[i] = "foundInPropal";
        }
    }

    // Vérifie les bonnes couleurs en mauvaise position
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

    // Affiche le retour de la proposition
    let lineResponse = document.createElement("div");
    lineResponse.textContent = `Bon endroit : ${cptGoodPlace} | Mauvais endroit : ${cptBadPlace}`;
    allSelectDiv.appendChild(lineResponse);

    // Condition de victoire
    if (cptGoodPlace === colorTabToFind.length) {
        gameOver = true;
        showMessage("Vous avez gagné ! Vous avez des super-pouvoirs 🧠 !");
        Confetti.launchAnimationConfeti();
        setTimeout(() => {
            Confetti.stopAnimationConfeti();
            resetGame("Bravo, vous avez gagné !");
        }, 5000);
    } else {
        handleFailedAttempt(); // Diminue les tentatives restantes
        if (attemptsRemaining > 0) {
            generateLineSelect(); // Génère une nouvelle ligne si le jeu continue
        }
    }
}

// Gère chaque tentative échouée et met à jour la barre de progression
function handleFailedAttempt() {
    if (attemptsRemaining > 0) {
        attemptsRemaining--;
        updateProgressBar(); // Met à jour la barre de progression

        if (attemptsRemaining === 1) {
            showMessage("Dernière chance ! C'est le moment de devenir un génie...");
        } else if (attemptsRemaining <= 3) {
            showMessage(`Oups ! Il reste ${attemptsRemaining} essais. Un café peut-être ? ☕`);
        } else {
            showMessage(`Pas encore trouvé ? Il reste ${attemptsRemaining} essais. Allez, on y croit !`);
        }
    }

    // Condition de défaite
    if (attemptsRemaining === 0) {
        gameOver = true;
        resetGame("Vous avez perdu ! Plus de tentatives restantes.");
        showMessage("Game Over ! La prochaine fois, demandez conseil à un chat 🐱.");
    }
}

// Génère une nouvelle ligne de sélection
function generateLineSelect() {
    if (gameOver) return;

    const lineContainer = document.createElement("div");
    lineContainer.classList.add("line-container");

    // Crée une nouvelle ligne pour les sélecteurs de couleur
    let line = document.createElement("div");
    line.classList.add("select-line");
    for (let index = 0; index < nbColorToFind; index++) {
        generateSelect(line);
    }

    // Bouton pour valider la proposition
    let btn = document.createElement("button");
    btn.textContent = "OK";
    btn.classList.add("btn-validate");
    line.appendChild(btn);
    btn.addEventListener("click", () => {
        checkProposition();
    });
    lineContainer.appendChild(line);

    // Barre de progression placée sous la ligne de sélecteurs
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-bar");
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progressContainer.appendChild(progress);
    lineContainer.appendChild(progressContainer);

    allSelectDiv.appendChild(lineContainer);
    updateProgressBar();
}

// Génère un sélecteur de couleur pour chaque emplacement de la ligne
function generateSelect(target) {
    let mySelect = document.createElement("select");
    colors.forEach(color => {
        let colorOption = document.createElement("option");
        colorOption.value = color;
        colorOption.style.backgroundColor = color;
        colorOption.textContent = color;
        mySelect.appendChild(colorOption);
    });
    mySelect.style.backgroundColor = mySelect.value;

    mySelect.addEventListener("change", (e) => {
        e.target.style.backgroundColor = e.target.value;
    });
    target.appendChild(mySelect);
}

// Génère une combinaison de couleurs aléatoires pour la partie
function setAleaColorTab(size = nbColorToFind) {
    colorTabToFind = [];
    for (let index = 0; index < size; index++) {
        colorTabToFind.push(getAleaColor());
    }
}

// Sélectionne une couleur aléatoire depuis le tableau des couleurs
function getAleaColor() {
    let aleaIndex = Utils.getRandomInt(colors.length);
    return colors[aleaIndex];
}

// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
    const progressBars = document.querySelectorAll('.progress');
    const currentProgressBar = progressBars[progressBars.length - 1];
    const progressPercentage = (attemptsRemaining / maxAttempts) * 100;
    currentProgressBar.style.width = `${progressPercentage}%`;
}

// Réinitialise le jeu avec un message de fin
function resetGame(message) {
    alert(message);
    document.getElementById("startButton").disabled = false;
    showMessage("Appuyez sur 'Go' pour une nouvelle partie ! Qui sait, aujourd'hui est peut-être votre jour de chance !");
}


// Fonction pour afficher des messages
function showMessage(message) {
    messageBox.textContent = message;
}
