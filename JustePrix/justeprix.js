import { Confetti } from "../lib/confetti.js";
import { Utils } from "../lib/Utils/utils.js";

let NumberToFind = 0;
const resultDiv = document.getElementById("resultDiv");
const reboursDiv = document.getElementById("CompteARebours");
const GamePropalDiv = document.getElementById("GamePropalDiv");
const playButton = document.getElementById("beginGame");
let TempsRestant = 0;
let compteurInterval = null;

playButton.addEventListener("click", launchGame);
document.getElementById("checkPropalButton").addEventListener("click", checkPropal);
document.getElementById("userPropalInput").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        checkPropal();
    }
});

function checkPropal() {
    const numberPropal = parseInt(document.getElementById("userPropalInput").value);
    if (isNaN(numberPropal)) {
        resultDiv.textContent = "Veuillez entrer un nombre valide.";
        resultDiv.classList.add("result-visible");
        return;
    }

    resultDiv.classList.remove("result-visible", "result-more", "result-less");

    if (NumberToFind > numberPropal) {
        resultDiv.textContent = "C'est plus !";
        resultDiv.classList.add("result-more", "result-visible");
        new Audio("audio/plus.mp3").play();
    } else if (NumberToFind < numberPropal) {
        resultDiv.textContent = "C'est moins !";
        resultDiv.classList.add("result-less", "result-visible");
        new Audio("audio/moins.mp3").play();
    } else {
        resultDiv.textContent = "C'est gagné !";
        resultDiv.classList.add("result-visible");
        endGame(true);
    }

    setTimeout(() => {
        resultDiv.classList.remove("result-visible", "result-more", "result-less");
    }, 2000);

    document.getElementById("userPropalInput").value = "";
}

function launchGame() {
    playButton.style.display = "none";
    Confetti.stopAnimationConfeti();
    NumberToFind = Utils.getRandomInt(1000);
    TempsRestant = 30;
    GamePropalDiv.style.display = "flex";
    if (compteurInterval != null) {
        clearInterval(compteurInterval);
    }
    compteurInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    reboursDiv.innerText = TempsRestant;
    TempsRestant--;

    if (TempsRestant >= 20) {
        reboursDiv.className = "reboursDiv cool";
    } else if (TempsRestant > 10) {
        reboursDiv.className = "reboursDiv warning";
    } else if (TempsRestant >= 0) {
        reboursDiv.className = "reboursDiv danger";
    } else {
        clearInterval(compteurInterval);
        endGame(false);
    }
}

function endGame(gagne) {
    if (gagne) {
        Confetti.launchAnimationConfeti();
        new Audio("audio/Bipbip.mp3").play();
        resultDiv.textContent = "C'est gagné !";
        resultDiv.classList.add("result-visible");
        setTimeout(() => {
            Confetti.stopAnimationConfeti();
        }, 5000);
    } else {
        new Audio("audio/tes_mauvais_jack.mp3").play();
        resultDiv.textContent = "Perdu !";
        resultDiv.classList.add("result-visible");
    }
    playButton.style.display = "block";
    GamePropalDiv.style.display = "none";
    clearInterval(compteurInterval);
}
