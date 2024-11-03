/**
 * DEROULEMENT D'UN TOUR :
 * OK Générer des cartes aléatoirement
 * OK Laisser les cartes visibles pendant 5 secondes
 * OK Choisir une carte au hasard parmi les cartes tirées
 * Laisser 3 secondes au joueur pour choisir une carte
 * OK Si gagné recommencer le tour
 * OK Si perdu, fin de la partie
 * 
 * Sauvegarder le score en cookie
 * 
 */

import { Utils } from "../lib/Utils/utils.js";

const plateau = document.getElementById("CardsPlateau");
const elementToFindDiv = document.getElementById("elementToFind");
const nbTourGagneSpan = document.getElementById("nbTourGagneSpan");
const nbCardsParam = 5;
let nbTourGagne = 0;
let classCardToFind;


let modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    beforeClose: function () {
        return true;
    }
});
modal.addFooterBtn('OK', 'tingle-btn tingle-btn--danger', function () {
    modal.close();
});

document.getElementById("newGameButton").addEventListener("click", newGame);

function newGame() {
    nbTourGagne = 0;
    newTour();
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function newTour() {
    nbTourGagneSpan.textContent = nbTourGagne;
    clearElement(plateau);
    clearElement(elementToFindDiv);
    generateCards(nbCardsParam);
    let nbCardToFind = Utils.getRandomInt(nbCardsParam);
    let cardsPlateau = plateau.querySelectorAll(".perso");
    classCardToFind = cardsPlateau[nbCardToFind].classList;
    let cptSeconds = 5;
    elementToFindDiv.textContent = cptSeconds;
    let CompteARebours = setInterval(() => {
        cptSeconds--;
        elementToFindDiv.textContent = cptSeconds;
        if (cptSeconds === 0) {
            clearInterval(CompteARebours);
            let allCards = document.querySelectorAll(".perso");
            allCards.forEach(card => {
                card.classList.add("hidden");
                card.addEventListener("click", function clickOnCard() {
                    if (card.classList.contains("hidden")) {
                        if (classCardToFind.value === card.classList.value) {
                            nbTourGagne++;
                            newTour();
                            modal.setContent('Perdu, votre score est de ' + nbTourGagne);
                            modal.open();
                            allCards.forEach(cardWhenLoose => {
                                cardWhenLoose.classList.remove("hidden");
                            });
                        }
                    }
                });
            });
            let newCardToFind = document.createElement("div");
            newCardToFind.classList = classCardToFind;
            newCardToFind.classList.remove("hidden");
            clearElement(elementToFindDiv);
            elementToFindDiv.appendChild(newCardToFind);
        }
    }, 1000);
}

function generateCards(nbCards) {
    for (let i = 0; i < nbCards; i++) {
        let newCard = document.createElement("div");
        newCard.classList.add("perso");
        let nbPersoAlea = Utils.getRandomInt(24);
        newCard.classList.add("perso" + nbPersoAlea);

        plateau.appendChild(newCard);
    }
}
