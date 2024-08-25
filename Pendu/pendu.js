/*
 
    X Générer un mot aléatoire
    X Afficher le mot en masqué _ _ _ _ _ _ _
    X Pouvoir proposer des lettres
    X Afficher les lettres trouvées
    X Gérer un nombre d'erreur max
    X Gérer la victoire    
    O Afficher des lettres visibles (en fonction de la difficulté)
*/
import { Confetti } from "../lib/confetti.js";
import { Utils } from "../lib/Utils/utils.js";

const allWords = ["ministre", "congolais", "constitution",
    "corompre", "petrole", "dictateur", "sapeur",
    "prisonnier", "chomage", "economie"];
const buttonPlay = document.getElementById("beginGame");
const wordToFindDiv = document.getElementById("wordToFindDiv");
const KeyBoardDiv = document.getElementById("KeyBoard");
const cptErreurDiv = document.getElementById("cptErreur");
const imgPendu = document.getElementById("imagePendu");
let wordToFind;
let wordToFindArray;
let cptErreur = 0;
let cptLettreTrouvees = 0;
const maxErreurs = 4; // Nombre maximum d'erreurs avant de perdre

buttonPlay.addEventListener("click", function () {
    initGame();
});

function initGame() {
    // Réinitialiser l'état du jeu
    Confetti.stopAnimationConfeti();
    cptErreur = 0;
    imgPendu.className = '';
    imgPendu.classList.add("etat" + cptErreur);
    cptLettreTrouvees = 0;
    wordToFindDiv.innerHTML = '';
    wordToFind = generateWord();
    wordToFindArray = Array.from(wordToFind);

    let table = document.createElement("table");

    let line = document.createElement("tr");
    line.id = "LineOfWord";
    wordToFindArray.forEach(letter => {
        // Créer un TD (case du tableau) par lettre
        let td = document.createElement("td");
        td.dataset.letter = letter;
        td.textContent = "_";
        line.appendChild(td);
    });

    table.appendChild(line);
    wordToFindDiv.appendChild(table);

    generateKeyBoard();
}

function generateKeyBoard() {
    KeyBoardDiv.innerHTML = '';
    let alphabet = generateAlphabet();
    alphabet.forEach(letter => {
        let lettreDiv = document.createElement("div");
        lettreDiv.textContent = letter;
        lettreDiv.classList.add("letterKeyBoard");
        KeyBoardDiv.appendChild(lettreDiv);

        lettreDiv.addEventListener("click", () => {
            if (checkLetterInWord(letter)) {
                // Afficher la lettre dans le mot masqué
                let lineWord = document.getElementById("LineOfWord");
                let allTdOfWord = lineWord.children;
                Array.from(allTdOfWord).forEach(td => {
                    if (td.dataset.letter === letter) {
                        td.textContent = letter;
                        cptLettreTrouvees++;
                    }
                });

                if (cptLettreTrouvees === wordToFindArray.length) {
                    // Victoire
                    KeyBoardDiv.innerHTML = '';
                    cptErreurDiv.textContent = `Gagné, avec ${cptErreur} erreur(s)`;
                    Confetti.launchAnimationConfeti();
                    setTimeout(() => {
                        Confetti.stopAnimationConfeti();
                    }, 5000);
                }
            } else {
                // Incrémenter le compteur d'erreur
                cptErreur++;
                cptErreurDiv.textContent = cptErreur;
                imgPendu.className = '';
                imgPendu.classList.add("etat" + cptErreur);
                if (cptErreur >= maxErreurs) {
                    // Défaite
                    cptErreurDiv.textContent = "Perdu, vous avez fait plus de 4 erreurs.";
                    let lineWord = document.getElementById("LineOfWord");
                    let allTdOfWord = lineWord.children;
                    Array.from(allTdOfWord).forEach(td => {
                        td.textContent = td.dataset.letter;
                    });
                    KeyBoardDiv.innerHTML = '';
                }
            }

            lettreDiv.style.visibility = "hidden";
        });
    });
}

function generateAlphabet(capital = false) {
    let tab = [];
    let i = capital ? 65 : 97;
    let finish = i + 26;
    for (; i < finish; i++) {
        tab.push(String.fromCharCode(i));
    }
    return tab;
}

function generateWord() {
    let indexWord = Utils.getRandomInt(allWords.length);
    return allWords[indexWord];
}

// Retourne true si la lettre est présente dans le mot
// Retourne false si la lettre est absente du mot
function checkLetterInWord(letter) {
    return wordToFindArray.includes(letter);
}
